import express from 'express'
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