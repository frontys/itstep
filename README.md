# react-itstep

React assignments from ITStep courses. One folder per date.

## Live demos (GitHub Pages)

| Assignment | Link |
|---|---|
| 10-06-26 | https://frontys.github.io/react-itstep/react-10-06-26/ |
| 10-07-26 | https://frontys.github.io/react-itstep/react-10-07-26/ |

Index: https://frontys.github.io/react-itstep/

## Add new assignment

```powershell
# 1. copy scaffold from previous date into new folder react-DD-MM-YY
# 2. vite.config.ts: base: '/react-itstep/react-DD-MM-YY/', outDir: '../docs/react-DD-MM-YY'
# 3. build:
cd react-DD-MM-YY
npm install
npm run build    # outputs to docs/
# 4. add link to docs/index.html, commit & push (Pages serves /docs)
```

## Stack
Vite + React 19 + TypeScript

## License
MIT
