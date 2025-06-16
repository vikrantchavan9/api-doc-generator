import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
     const body = await req.json();
     const fields: { path: string; type: string }[] = body.fields;

     const prompt = `
You are a helpful assistant that writes concise documentation for JSON API fields.

Generate a description for each field below:

${fields.map(f => `- ${f.path} (${f.type})`).join('\n')}
`;

     const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
               contents: [{ parts: [{ text: prompt }] }]
          }),
     });

     const geminiData = await geminiRes.json();

     console.log(JSON.stringify(geminiData, null, 2));

     const output = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

     const lines = output
          .split('\n')
          .filter((line: string) => line.trim().startsWith('-'))
          .map((line: string) => {
               const match = line.match(/- (.*?) \((.*?)\):? (.*)/);
               if (!match) return { path: '', description: '' };
               const [, path, , desc] = match;
               return { path, description: desc?.trim() || '' };
          });

     return NextResponse.json(lines);
}
