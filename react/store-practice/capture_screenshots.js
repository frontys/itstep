const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.id = 1;
        this.pending = new Map();
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.id && this.pending.has(data.id)) {
                this.pending.get(data.id)(data.result);
                this.pending.delete(data.id);
            }
        };
    }

    async ready() {
        if (this.ws.readyState === WebSocket.OPEN) return;
        return new Promise((resolve, reject) => {
            this.ws.onopen = resolve;
            this.ws.onerror = reject;
        });
    }

    send(method, params = {}) {
        return new Promise(resolve => {
            const currentId = this.id++;
            this.pending.set(currentId, resolve);
            this.ws.send(JSON.stringify({ id: currentId, method, params }));
        });
    }

    async evaluate(expression) {
        return this.send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true
        });
    }

    async captureScreenshot(outputPath) {
        const result = await this.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outputPath, Buffer.from(result.data, 'base64'));
        console.log(`Saved screenshot: ${outputPath}`);
    }

    close() {
        this.ws.close();
    }
}

async function main() {
    console.log('1. Starting Express server...');
    const serverProc = spawn('node', ['server.js'], {
        cwd: path.join(__dirname, 'server'),
        stdio: 'ignore'
    });

    console.log('2. Starting Vite dev server...');
    const viteProc = spawn('npm.cmd', ['run', 'dev'], {
        cwd: path.join(__dirname, 'client'),
        shell: true,
        stdio: 'ignore'
    });

    let chromeProc = null;
    let cdp = null;

    try {
        console.log('Waiting for servers to start...');
        await sleep(3000);

        console.log('3. Starting headless Chrome...');
        chromeProc = spawn(CHROME_PATH, [
            '--headless=new',
            '--remote-debugging-port=9222',
            '--window-size=1280,960',
            '--disable-gpu',
            'about:blank'
        ], { stdio: 'ignore' });

        await sleep(2000);

        console.log('4. Connecting to Chrome CDP...');
        const newPageResp = await fetch('http://127.0.0.1:9222/json/new?http://localhost:5173', { method: 'PUT' });
        const pageInfo = await newPageResp.json();
        
        cdp = new CDPClient(pageInfo.webSocketDebuggerUrl);
        await cdp.ready();
        await cdp.send('Page.enable');
        await cdp.send('Runtime.enable');

        await sleep(2000);

        // Screenshot 1: List view with summary metrics and products
        console.log('Capturing Screenshot 1: Список товаров...');
        await cdp.captureScreenshot(path.join(OUTPUT_DIR, 'screenshot1_list.png'));

        // Screenshot 2: Add form filled with new product
        console.log('Filling form for Screenshot 2: Добавление товара...');
        await cdp.evaluate(`
            (() => {
                const nameInput = document.getElementById('name');
                const catInput = document.getElementById('category');
                const priceInput = document.getElementById('price');
                const qtyInput = document.getElementById('quantity');

                const setValue = (elem, val) => {
                    elem.value = val;
                    elem.dispatchEvent(new Event('input', { bubbles: true }));
                    elem.dispatchEvent(new Event('change', { bubbles: true }));
                };

                setValue(nameInput, 'Игровые наушники PRO');
                setValue(catInput, 'Аудио');
                setValue(priceInput, '1450');
                setValue(qtyInput, '15');
            })()
        `);
        await sleep(500);
        await cdp.captureScreenshot(path.join(OUTPUT_DIR, 'screenshot2_add.png'));

        // Reset form
        await cdp.evaluate(`
            (() => {
                const setValue = (elem, val) => {
                    elem.value = val;
                    elem.dispatchEvent(new Event('input', { bubbles: true }));
                };
                setValue(document.getElementById('name'), '');
                setValue(document.getElementById('category'), '');
                setValue(document.getElementById('price'), '');
                setValue(document.getElementById('quantity'), '');
            })()
        `);
        await sleep(300);

        // Screenshot 3: Edit mode for mouse
        console.log('Activating Edit mode for Screenshot 3: Редактирование товара...');
        await cdp.evaluate(`
            (() => {
                // Нажимаем первую кнопку Изменить в таблице
                const editButtons = Array.from(document.querySelectorAll('button.secondary'));
                if (editButtons.length > 0) editButtons[0].click();
            })()
        `);
        await sleep(500);
        await cdp.captureScreenshot(path.join(OUTPUT_DIR, 'screenshot3_edit.png'));

        // Cancel edit
        await cdp.evaluate(`
            (() => {
                const cancelBtn = Array.from(document.querySelectorAll('button.secondary')).find(b => b.textContent.includes('Отмена'));
                if (cancelBtn) cancelBtn.click();
            })()
        `);
        await sleep(300);

        // Screenshot 4: Error notification (submit empty / trigger validation)
        console.log('Triggering error for Screenshot 4: Сообщение об ошибке...');
        await cdp.evaluate(`
            (() => {
                // Убираем required временно, чтобы сработал React-валидатор или сетевая ошибка
                document.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
                document.querySelector('form button[type="submit"]').click();
            })()
        `);
        await sleep(500);
        await cdp.captureScreenshot(path.join(OUTPUT_DIR, 'screenshot4_error.png'));

        console.log('All screenshots captured successfully!');
    } catch (err) {
        console.error('Error during capture:', err);
    } finally {
        if (cdp) cdp.close();
        if (chromeProc) chromeProc.kill();
        serverProc.kill();
        viteProc.kill();
        console.log('Cleanup completed.');
    }
}

main();
