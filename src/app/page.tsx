'use client';
import { useState } from 'react';

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

      {result.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Parsed Output</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
