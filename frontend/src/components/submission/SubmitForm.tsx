// frontend/src/components/submission/SubmitForm.tsx
"use client";
import { useState } from 'react';

export const SubmitForm = () => {
  const [status, setStatus] = useState<'IDLE' | 'MISSING' | 'SUCCESS'>('IDLE');
  const [missingSongs, setMissingSongs] = useState<string[]>([]);
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    // Call API logic here...
    // If response.status === "INCOMPLETE":
    //   setMissingSongs(response.missing_songs)
    //   setStatus('MISSING')
  };

  return (
    <div className="bg-zinc-900 p-6 border border-zinc-800 rounded-sm">
      <h2 className="text-xl font-black uppercase mb-6">Submit Rankings</h2>
      
      {status === 'MISSING' && (
        <div className="bg-amber-500/10 border border-amber-500/50 p-4 mb-6 text-sm text-amber-200">
          <p className="font-bold mb-2">⚠️ Missing Songs Detected</p>
          <p>The songs below were found in the database but not in your list. Rank them to complete your submission:</p>
          <ul className="mt-2 list-disc list-inside opacity-70">
            {missingSongs.map(s => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}

      <textarea 
        className="w-full h-64 bg-slate-950 border border-zinc-800 p-4 font-mono text-sm focus:border-pink-500 outline-none transition-all"
        placeholder="1. Song Name - Artist..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button 
        onClick={handleSubmit}
        className="w-full mt-4 bg-pink-500 text-black font-black py-4 uppercase hover:bg-pink-400 transition-all"
      >
        {status === 'MISSING' ? 'Finalize Submission' : 'Post Rankings'}
      </button>
    </div>
  );
};