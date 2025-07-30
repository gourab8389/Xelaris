import { useState } from 'react'
import viteLogo from '/vite.svg'
import reactLogo from './assets/react.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-24 hover:animate-pulse" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-24 animate-spin-slow hover:animate-spin" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-foreground">Vite + React</h1>
        
        <div className="mb-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            count is {count}
          </button>
        </div>
        
        <p className="text-muted-foreground text-center max-w-md">
          Edit <code className="bg-muted px-2 py-1 rounded text-muted-foreground font-mono text-sm">src/App.tsx</code> and save to test HMR
        </p>
        
        <p className="text-muted-foreground mt-4 text-center">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App