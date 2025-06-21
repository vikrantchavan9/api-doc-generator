'use client';
import { useState } from 'react';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { flattenJSON } from '@/utils/flatten';

export default function Home() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [airesult, setAiresult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleaiSubmit = async () => {
    setLoading(true);
    setStatus('');

    const fields = result.map(({ path, type }) => ({ path, type })).filter(f => f.path && f.type);

    if (fields.length === 0) {
      console.warn("No valid fields to send");
      setStatus('error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://6dnr1ysdr2.execute-api.ap-south-1.amazonaws.com/prod/generate-api-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });

      const raw = await res.json();
      console.log("Raw Lambda response:", raw);

      const responseText = raw.text || raw.completion || JSON.stringify(raw);
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      const cleaned = jsonMatch ? jsonMatch[1] : responseText;
      const data = JSON.parse(cleaned);

      if (!Array.isArray(data)) {
        console.error("Expected array from AI, got:", data);
        throw new Error("Invalid AI response");
      }

      const cleanPath = (path: string) =>
        path.replace(/`/g, '').replace(/^\d+\./, '').trim();

      const updated = result.map((item) => {
        const found = data.find((f: any) => {
          const cleanedAI = cleanPath(f.path);
          const cleanedItem = cleanPath(item.path);
          return cleanedAI === cleanedItem;
        });

        return {
          ...item,
          description: found?.description || item.description,
          fromAI: !item.description && !!found?.description,
        };
      });

      setResult(updated);
      setAiresult(data);
      setStatus('success');
    } catch (err) {
      console.error("Fetch failed:", err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleParseSubmit = async () => {
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
        onClick={handleParseSubmit}
        className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Parse
      </button>



      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">

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
                setInput(JSON.stringify(parsed, null, 2));
                setResult(flattenJSON(parsed));
              } catch (err) {
                alert("Invalid JSON file");
              }
            };
            reader.readAsText(file);
          }}
          className="my-4 bg-gray-100 text-black p-2"
        />
      </div>
      <div className='flex  gap-2 max-w-auto'>
        <button
          disabled={loading}
          onClick={handleaiSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Auto-Fill Descriptions
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
          className="px-4 py-2 bg-gray-800 text-white rounded"
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
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Download Markdown
        </button>
      </div>



      {/* Feedback Messages */}
      {loading && (
        <div className="mt-2 flex items-center space-x-2 text-blue-600 text-sm">
          <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Generating descriptions...</span>
        </div>
      )}

      {status === 'success' && (
        <p className="mt-2 text-green-600 text-sm">Descriptions updated successfully ✅</p>
      )}

      {status === 'error' && (
        <p className="mt-2 text-red-600 text-sm">Something went wrong ❌</p>
      )}

      {result.length > 0 && (
        <p className="mt-1 text-sm text-gray-700">
          Descriptions filled: {result.filter(r => r.description?.trim()).length} / {result.length}
        </p>
      )}

      {/* Results Table */}
      {result.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Parsed Output</h2>
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-black text-white">
                <tr>
                  <th className="p-2 border-b">Path</th>
                  <th className="p-2 border-b">Type</th>
                  <th className="p-2 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {result.map((item, idx) => (
                  <tr key={idx} className={`hover:bg-gray-800 ${item.fromAI ? 'bg-gray-900' : ''}`}>
                    <td className="p-2 border-b font-mono">{item.path}</td>
                    <td className="p-2 border-b">{item.type}</td>
                    <td className="p-2 border-b">
                      <input
                        type="text"
                        className="w-full p-1 border rounded text-xs"
                        value={item.description}
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
