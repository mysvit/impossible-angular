## Node.js examples

- [Run *.ts files](#run-ts-files)
- [Main thread starvation](#main-thread-starvation)

### Run *.ts files
```bash
mkdir nodets && cd nodets
npm init --yes
echo "console.log('Hello NodeTS.')" > 'server.ts'
node --experimental-strip-types server.ts
```

### Main thread starvation

[**Source project:** main-thread](main-thread)

**Briefly**: Simulate a main thread starvation in nodejs. Use a profile to find a bottleneck. Use a worker to avoid a main thread starvation. 
Source code in main-thred folder.

**Usage:**

Serve and debug
```bash
node --experimental-strip-types --inspect server.ts
```

Serve and write profile
```bash
node --experimental-strip-types --prof server.ts
```

Parce profile
```bash
node --prof-process isolate-0x1671c000-65753-v8.log > processed.txt
```
In browser:

To block main thread for 30s run:
```
http://localhost:3000/fibonacci-block/45
```

To see how main thread block other request just open random api in same time in second tab.
```
http://localhost:3000/random
```

To avoid block main thread use worker. It will run for 30s but not blocks other api.
```
http://localhost:3000/fibonacci/45
```

Create project from scratch.
```bash
mkdir main-thread && cd main-thread
npm init --yes
npm install express
npm install --save-dev typescript @types/node @types/express
npx tsc --init
```

Add to package.json
```"type": "module"` 

Add to tsconfig.json
```
"module": "ES2022",
"target": "ES2022",
"allowSyntheticDefaultImports": true,
"moduleResolution": "node",
"allowImportingTsExtensions": true
```

server.ts
```JS
import { Worker } from 'node:worker_threads'
import { fibonacci } from './fibonacci.ts'

function fibonacciRunWorker(n: number) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./fibonacci-worker.ts', {
            workerData: n
        })
        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Exit code: ${code}`))
            }
        })
    })
}

const app = express()

app.get('/random', (req, res) => {
    res.send(Math.random().toString())
})

app.get('/fibonacci/:n', async (req, res) => {
    const fib = await fibonacciRunWorker(Number.parseInt(req.params.n))
    res.send('Fibonacci: ' + fib)
})

app.get('/fibonacci-block/:n', (req, res) => {
    const fib = fibonacci(Number.parseInt(req.params.n))
    res.send('Fibonacci: ' + fib)
})

app.listen(3000, () => {
    console.log('Server running on port', 3000)
})
```

fibonacci-worker.ts
```JS
import { parentPort, workerData } from 'node:worker_threads'
import { fibonacci } from './fibonacci.ts'


const result = fibonacci(workerData)
parentPort?.postMessage(result)
```

fibonacci.ts
```JS
export function fibonacci(n: number): number {
    if (n === 0) return 0
    if (n === 1) return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```
