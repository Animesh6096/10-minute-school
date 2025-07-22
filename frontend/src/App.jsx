import Chat from './components/Chat'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
