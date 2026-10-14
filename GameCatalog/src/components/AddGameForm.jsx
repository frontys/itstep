import { useState } from 'react';

export default function AddGameForm() {
  const [form, setForm] = useState({
    title: '',
    publisher: '',
    price: '',
    genre: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="add-box">
      <h3>Add Game</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>
          Publisher:
          <input name="publisher" value={form.publisher} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input name="price" type="number" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Genre:
          <input name="genre" value={form.genre} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
