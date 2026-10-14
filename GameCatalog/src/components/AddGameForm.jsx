import { useState } from 'react';

const emptyForm = {
  title: '',
  publisher: '',
  price: '',
  genre: '',
  minAge: '',
  description: '',
  image: '',
};

export default function AddGameForm({ onAddGame }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [readingImage, setReadingImage] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 500 * 1024) {
      setError('Please choose a JPG, PNG, or WebP image under 500 KB.');
      e.target.value = '';
      return;
    }

    setError('');
    setReadingImage(true);

    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: String(reader.result) }));
      setReadingImage(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setReadingImage(false);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = form.title.trim();
    const publisher = form.publisher.trim();
    const genre = form.genre.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const minAge = Number(form.minAge);

    if (title.length < 2 || title.length > 120) {
      setError('Title must be between 2 and 120 characters.');
      return;
    }
    if (publisher.length < 2 || publisher.length > 100) {
      setError('Publisher must be between 2 and 100 characters.');
      return;
    }
    if (genre.length < 2 || genre.length > 40) {
      setError('Genre must be between 2 and 40 characters.');
      return;
    }
    if (description.length < 20 || description.length > 1000) {
      setError('Description must be between 20 and 1000 characters.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || price > 100000) {
      setError('Price must be a valid number between 0.01 and 100,000 UAH.');
      return;
    }
    if (!Number.isInteger(minAge) || minAge < 3 || minAge > 18) {
      setError('Minimum age must be an integer between 3 and 18.');
      return;
    }

    const img = form.image.trim();
    if (img && !/^https?:\/\//i.test(img) && !/^data:image\/(jpeg|png|webp);base64,/i.test(img)) {
      setError('Image must be a valid HTTP(S) URL or an uploaded image file.');
      return;
    }

    const newGame = {
      id: crypto.randomUUID(),
      title,
      publisher,
      price: Math.round(price * 100) / 100,
      genre,
      minAge,
      description,
      image: img || './images/fallback.svg',
    };

    const err = onAddGame(newGame);
    if (err) {
      setError(err);
    }
  }

  return (
    <div className="add-container">
      <h2>Add New Game</h2>
      {error && <div className="error-text">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Game Title:</label>
          <input name="title" value={form.title} onChange={handleChange} maxLength={120} required />
        </div>

        <div className="form-field">
          <label>Publisher / Developer:</label>
          <input name="publisher" value={form.publisher} onChange={handleChange} maxLength={100} required />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Price (UAH):</label>
            <input name="price" type="number" step="0.01" min="0.01" max="100000" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Genre:</label>
            <input name="genre" value={form.genre} onChange={handleChange} maxLength={40} placeholder="e.g. Action" required />
          </div>
          <div className="form-field">
            <label>Min Age (3-18):</label>
            <input name="minAge" type="number" min="3" max="18" step="1" value={form.minAge} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-field">
          <label>Description (20-1000 characters):</label>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} maxLength={1000} required />
        </div>

        <div className="form-field">
          <label>Image URL (Optional):</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://... or upload below" disabled={readingImage} />
        </div>

        <div className="form-field">
          <label>Or Upload Image (JPG/PNG/WebP, &lt; 500 KB):</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={readingImage} />
        </div>

        {readingImage && <p className="hint-text">Reading image file...</p>}

        <button type="submit" className="btn-block" disabled={readingImage}>Add Game to Catalog</button>
      </form>
    </div>
  );
}
