import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Корзина (${count})`;
  }, [count]);

  return (
    <main>
      <article className="card">
        <h1>Интернет-магазин</h1>
        <div className="out">
          <p>{"Count >>> "}{count}</p>
        </div>
        <div className="controls">
          <button onClick={() => setCount((prev) => prev + 1)}>Добавить</button>
          <button onClick={() => setCount(0)}>Очистить</button>
        </div>
      </article>
    </main>
  );
}

export default App;

