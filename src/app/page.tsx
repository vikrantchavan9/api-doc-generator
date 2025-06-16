'use client';
import { useState } from 'react';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { flattenJSON } from '@/utils/flatten';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [airesult, setAiresult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("Start Result :", result, "AI Result :", airesult, "End");

  const handleaiSubmit = async () => {
    setLoading(true)
    try {
      const fields = result.map(({ path, type }) => ({ path, type }));

      const res = await fetch('/api/generate-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });

      const data = await res.json();
      // console.log("AI raw response:", data);
      setAiresult(data);

      const cleanPath = (path: string) =>
        path.replace(/`/g, '').replace(/^\d+\./, '').trim();


      const updated = result.map((item) => {
        const found = data.find((f: any) => {
          const cleanedAI = cleanPath(f.path);
          const cleanedItem = cleanPath(item.path);
          return cleanedAI === cleanedItem;
        });

        if (!found) {
          console.warn("No match for:", item.path);
        }

        return {
          ...item,
          description: found?.description || item.description,
        };
      });

      console.log("Updated Result : ", updated);
      setResult(updated);
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }

  };



  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        body: input,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setResult(data);
      console.log("parse data: ", data);
    } catch (err) {
      alert('Invalid JSON');
    }
  };
  // console.log(result);
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <textarea
        rows={10}
        className="w-full p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON here...'
      />

      <div className='flex flex-col items-start justify-center'>
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const text = event.target?.result as string;
                const parsed = JSON.parse(text);
                setInput(JSON.stringify(parsed, null, 2)); // update textarea
                setResult(flattenJSON(parsed)); // auto-parse
              } catch (err) {
                alert("Invalid JSON file");
              }
            };
            reader.readAsText(file);
          }}
          className="mb-4 bg-gray-100 text-black p-2"
        />

        <button
          disabled={loading}
          onClick={handleaiSubmit}
        >
          Auto-Fill Descriptions with AI
        </button>

        <button
          onClick={handleSubmit}
          className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded"
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
          className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded"
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
          className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Download Markdown
        </button>
      </div>


      {result.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Parsed Output</h2>
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-left">
              <thead className="">
                <tr>
                  <th className="p-2 border-b">Path</th>
                  <th className="p-2 border-b">Type</th>
                  <th className="p-2 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {result.map((item, idx) => (
                  <tr key={idx} className="">
                    <td className="p-2 border-b font-mono">{item.path}</td>
                    <td className="p-2 border-b text-sm">{item.type}</td>
                    <td className="p-2 border-b text-sm">
                      <input
                        type="text"
                        className="w-full p-1 border rounded text-xs"
                        value={
                          item.description
                        }
                        onChange={(e) => {
                          const newResult = [...result];
                          newResult[idx].description = e.target.value;
                          setResult(newResult);
                        }}
                      />
                    </td>
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
