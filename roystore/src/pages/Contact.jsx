import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className='md:grid md:grid-cols-2'>
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src="/contact-image.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Get in Touch</h1>
          <p className="text-gray-200 mt-2">We'd love to hear from you.</p>
        </div>
      </div>

      <div className="px-4 md:px-12 py-10 grid grid-cols-1 md:grid-cols- gap-10 max-w-4xl">
        <div>
          <h2 className="font-bold text-lg mb-4">Contact Information</h2>
          <div className="flex items-center gap-3 text-gray-600 text-sm mb-3">
            <Mail size={18} className="text-primary" /> support@roystore.com
          </div>
          <div className="flex items-center gap-3 text-gray-600 text-sm mb-3">
            <Phone size={18} className="text-primary" /> +234 800 000 0000
          </div>
          <div className="flex items-center gap-3 text-gray-600 text-sm">
            <MapPin size={18} className="text-primary" /> Abuja, Nigeria
          </div>
        </div>

        <div>
          {sent ? (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4 text-green-700 text-sm">
              Thanks for reaching out! We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="text-sm font-medium block mb-1">Name</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Your name"
              />
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="you@example.com"
              />
              <label className="text-sm font-medium block mb-1">Message</label>
              <textarea
                value={message} onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                placeholder="How can we help?"
              />
              <button type="submit" className="bg-primary text-white font-semibold rounded-xl px-6 py-3 text-sm">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
      </div>

      <div className="bg-gray-50 px-4 md:px-12 py-8 mt-10 text-center">
        <p className="text-gray-400 text-xs">© 2026 Roystore. All rights reserved.</p>
        <p className="text-gray-400 text-xs mt-1">Built by Emmanuel</p>
      </div>
    </div>
  );
}