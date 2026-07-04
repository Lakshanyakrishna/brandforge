import { useEffect, useState } from 'react';
import api from '../api';

export default function GenerateDesign() {
  const [brandKits, setBrandKits] = useState([]);
  const [brandKitId, setBrandKitId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/brandkits').then((res) => {
      setBrandKits(res.data.data);
      if (res.data.data.length) setBrandKitId(res.data.data[0]._id);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/generate', { brandKitId, prompt });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Generate Design</h2>

      {brandKits.length === 0 ? (
        <p className="text-gray-500">Create a brand kit first.</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 max-w-xl">
          <label className="block text-sm font-medium mb-1">Brand Kit</label>
          <select value={brandKitId} onChange={(e) => setBrandKitId(e.target.value)} className="w-full border rounded px-3 py-2 mb-4">
            {brandKits.map((kit) => (
              <option key={kit._id} value={kit._id}>{kit.brandName}</option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-1">Prompt</label>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Diwali Sale, 30% OFF"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button type="submit" disabled={loading} className="bg-indigo-600 text-white rounded py-2 px-6 font-medium disabled:opacity-50">
            {loading ? 'Generating... (can take ~10-20s)' : 'Generate'}
          </button>
        </form>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <img src={result.imageUrl} alt="Generated design" className="w-full rounded mb-4" />
          <a href={result.imageUrl} download target="_blank" rel="noreferrer" className="text-indigo-600 font-medium">
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
