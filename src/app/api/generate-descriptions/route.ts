import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
     const body = await req.json();
     const fields: { path: string; type: string }[] = body.fields;

     const prompt = `
You are an API documentation assistant.

Based on the following fields, return a JSON array where each item has:
- path: string
- description: string

ONLY return valid JSON. No markdown, no commentary.

Fields:
${JSON.stringify(fields, null, 2)}
`;

     const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
               }),
          }
     );

     const geminiData = await geminiRes.json();
     let output = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

     // Clean output
     output = output.trim();
     if (output.startsWith('```json')) {
          output = output.replace(/```json|```/g, '').trim();
     }

     console.log("Gemini Raw Output:", output);

     try {
          const parsed = JSON.parse(output);
          return NextResponse.json(parsed);
     } catch (err) {
          console.error('Failed to parse Gemini response as JSON:', err);
          return NextResponse.json({ error: 'Invalid response from AI', raw: output }, { status: 500 });
     }
}
