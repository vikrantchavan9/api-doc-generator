'use client';
import { useState } from 'react';
import { generateMarkdown } from '@/utils/generateMarkdown';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        body: input,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Invalid JSON');
    }
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <textarea
        rows={10}
        className="w-full p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON here...'
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Parse
      </button>

      <button
        onClick={() => {
          const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'parsed_output.json';
          link.click();
          URL.revokeObjectURL(url);
        }}
        className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded"
      >
        Download JSON
      </button>

      <button
        onClick={() => {
          const markdown = generateMarkdown(result);
          const blob = new Blob([markdown], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'parsed_output.md';
          link.click();
          URL.revokeObjectURL(url);
        }}
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded ml-2"
      >
        Download Markdown
      </button>

      {result.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Parsed Output</h2>
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border-b">Path</th>
                  <th className="p-2 border-b">Type</th>
                </tr>
              </thead>
              <tbody>
                {result.map((item, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="p-2 border-b font-mono">{item.path}</td>
                    <td className="p-2 border-b text-sm">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
