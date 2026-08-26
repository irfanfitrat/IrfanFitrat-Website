'use client';
import { useState, useEffect } from 'react';

type Thought = {
  id: string;
  content: string;
  created_at: string;
};

export default function ThoughtsFeed() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState('');

  useEffect(() => {
    fetch('/api/thoughts')
      .then((res) => res.json())
      .then((data) => setThoughts(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    await fetch('/api/thoughts', {
      method: 'POST',
      body: JSON.stringify({ content: newThought }),
    });

    setNewThought('');
    const res = await fetch('/api/thoughts');
    const data = await res.json();
    setThoughts(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Thoughts</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          rows={3}
        />
        <button 
          type="submit" 
          className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Post Thought
        </button>
      </form>

      <div className="space-y-4">
        {thoughts.map((thought) => (
          <div key={thought.id} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">{thought.content}</p>
            <p className="text-sm text-gray-400 mt-4">
              {new Date(thought.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
