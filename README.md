# React Assignments — ITStep Academy

A multi-project monorepo containing interactive React 19 web applications developed during the front-end curriculum at ITStep Academy. Each date represents a dedicated standalone module.

---

## 🌐 Live Demos (GitHub Pages)

The projects are automatically deployed to GitHub Pages:

| Assignment Date | Topics / Features | Live Demo |
| :--- | :--- | :--- |
| **2026-10-06** | Basket counter, state management & side effects with `useEffect` | [Open Demo](https://frontys.github.io/react-itstep/react-10-06-26/) |
| **2026-10-07** | Auto-notification task scheduler and reactive triggers | [Open Demo](https://frontys.github.io/react-itstep/react-10-07-26/) |
| **2026-10-10** | Order management system and reactive UI updates | [Open Demo](https://frontys.github.io/react-itstep/react-10-10-26/) |

📖 **Main Showcase Portal:** [frontys.github.io/react-itstep](https://frontys.github.io/react-itstep/)

---

## 🛠️ Stack & Tooling

- **Core:** React 19, TypeScript
- **Bundler:** Vite
- **Deployment:** GitHub Pages (served from `/docs`)

---

## 🚀 Adding a New Assignment

```powershell
# 1. Copy scaffold from previous date into new directory react-DD-MM-YY
# 2. In vite.config.ts configure:
#    base: '/react-itstep/react-DD-MM-YY/'
#    build.outDir: '../docs/react-DD-MM-YY'
# 3. Build:
cd react-DD-MM-YY
npm install
npm run build    # outputs build artifacts to ../docs/
# 4. Add link to docs/index.html, commit and push to main
```

---

## 👤 Author

- GitHub: [@frontys](https://github.com/frontys)

## 📄 License

MIT
