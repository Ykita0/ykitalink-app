import { useState } from 'react';
import { format } from 'date-fns';

export default function Home() {
  const tshirts = [
    { name: 'Logo Ykita', image: 'https://via.placeholder.com/300x300?text=Logo+Ykita' },
    { name: 'Design Feu', image: 'https://via.placeholder.com/300x300?text=Design+Feu' },
    { name: 'Minimal Noir', image: 'https://via.placeholder.com/300x300?text=Minimal+Noir' },
    { name: 'Tête de Lion', image: 'https://via.placeholder.com/300x300?text=Tête+de+Lion' }
  ];

  const [formData, setFormData] = useState({
    imageType: '',
    size: '',
    quantity: 1,
    name: '',
    address: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectTshirt = (name) => {
    setFormData({ ...formData, imageType: name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const pdfContent = `Commande YkitaLink\nDate: ${timestamp}\nNom: ${formData.name}\nAdresse: ${formData.address}\nEmail: ${formData.email}\nType d'image: ${formData.imageType}\nTaille: ${formData.size}\nQuantité: ${formData.quantity}`;

    const res = await fetch('/api/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, pdfContent })
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Commande de T-shirt - YkitaLink</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <input name="name" placeholder="Nom" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="address" placeholder="Adresse" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />

        <div className="grid grid-cols-2 gap-4">
          {tshirts.map((tshirt, index) => (
            <div key={index} onClick={() => handleSelectTshirt(tshirt.name)} className={\`border p-2 rounded cursor-pointer \${formData.imageType === tshirt.name ? 'border-blue-500' : ''}\`}>
              <img src={tshirt.image} alt={tshirt.name} className="w-full h-40 object-cover rounded" />
              <p className="text-center mt-2 font-semibold">{tshirt.name}</p>
            </div>
          ))}
        </div>

        <select name="size" onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">-- Choisir la taille --</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <input name="quantity" type="number" min="1" onChange={handleChange} value={formData.quantity} required className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Valider la commande</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
