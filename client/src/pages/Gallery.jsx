import { useEffect, useState } from 'react';
import api from '../api';

export default function Gallery() {
  const [designs, setDesigns] = useState([]);

  function load() {
    api.get('/designs').then((res) => setDesigns(res.data.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    await api.delete(`/designs/${id}`);
    load();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gallery</h2>
      {designs.length === 0 ? (
        <p className="text-gray-500">No designs yet — generate one first.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {designs.map((design) => (
            <div key={design._id} className="bg-white rounded-lg shadow p-4">
              <img src={design.imageUrl} alt={design.prompt} className="w-full rounded mb-2" />
              <p className="text-sm text-gray-600 truncate">{design.prompt}</p>
              <div className="flex justify-between items-center mt-2">
                <a href={design.imageUrl} download target="_blank" rel="noreferrer" className="text-indigo-600 text-sm">Download</a>
                <button onClick={() => handleDelete(design._id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
