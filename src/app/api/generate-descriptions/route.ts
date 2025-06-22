import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
     try {
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

          // It's good practice to wrap external API calls in a try-catch too
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

          if (!geminiRes.ok) {
               const errorBody = await geminiRes.text();
               console.error(`Gemini API error: ${geminiRes.status} - ${errorBody}`);
               return NextResponse.json({ error: 'Failed to get response from AI model', details: errorBody }, { status: geminiRes.status });
          }

          const geminiData = await geminiRes.json();
          let output = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

          // Clean output
          output = output.trim();
          if (output.startsWith('```json')) {
               output = output.replace(/```json|```/g, '').trim();
          }

          console.log("Gemini Raw Output (cleaned):", output);

          try {
               // Type 'parsed' if you have an interface for it (e.g., AIResponseItem[])
               // const parsed: AIResponseItem[] = JSON.parse(output);
               const parsed = JSON.parse(output);
               return NextResponse.json(parsed);
          } catch (parseError: unknown) { // Use 'unknown' for catch variables

               console.error('Failed to parse Gemini response as JSON:', parseError);
               return NextResponse.json({ error: 'Invalid response from AI (JSON parsing failed)', raw: output, details: String(parseError) }, { status: 500 });
          }
     } catch (requestError: unknown) {
          console.error('Request processing error:', requestError);
          return NextResponse.json({ error: 'Internal server error processing request', details: String(requestError) }, { status: 500 });
     }
}