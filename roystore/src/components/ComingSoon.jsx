import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';

export default function ComingSoon({ title = 'This page' }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Wrench size={28} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold mb-2">{title} is being worked on</h1>
        <p className="text-gray-500 text-sm mb-8">We're building this out — check back soon.</p>
        <button onClick={() => navigate(-1)} className="bg-primary text-white font-semibold rounded-xl px-6 py-3">Go Back</button>
      </div>
    </div>
  );
}