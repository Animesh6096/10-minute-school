import React, { useState, useRef, useEffect } from 'react'

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'আস্সালামু আলাইকুম! আমি আপনার বাংলা ও ইংরেজি প্রশ্নের উত্তর দিতে পারি। HSC বাংলা সাহিত্য সম্পর্কে যেকোনো প্রশ্ন করুন।\n\nHello! I can answer your questions in both Bengali and English. Feel free to ask any questions about HSC Bangla literature.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [apiUrl] = useState('http://localhost:8000')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectLanguage = (text) => {
    const bengaliChars = /[\u0980-\u09FF]/
    return bengaliChars.test(text) ? 'bn' : 'en'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
          language: detectLanguage(userMessage.content)
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        context_chunks: data.context_chunks,
        confidence_score: data.confidence_score,
        metadata: data.metadata,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        type: 'assistant',
        content: 'দুঃখিত, একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।\n\nSorry, there was an error. Please try again.\n\n' + 
                 `Error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const sampleQuestions = [
    "অনুপমের ভাষায় সুপুরুষ কাকে বলা হয়েছে?",
    "কাকে অনুপমের ভাগ্য দেবতা বলে উল্লেখ করা হয়েছে?",
    "বিয়ের সময় কল্যাণীর প্রকৃত বয়স কত ছিল?",
    "Who is described as a good man according to Anupam?"
  ]

  return (
    <div className="chat-container mx-auto h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">RAG Assistant</h3>
            <p className="text-sm text-gray-600">HSC Bangla Literature Expert</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]">
              <div 
                className={`
                  p-4 rounded-2xl shadow-sm
                  ${message.type === 'user' 
                    ? 'message-user' 
                    : message.isError 
                      ? 'bg-red-50 text-red-800 border border-red-200' 
                      : 'message-assistant'
                  }
                `}
              >
                <div className="whitespace-pre-wrap break-words font-bengali">
                  {message.content}
                </div>
                
                {/* Show metadata for assistant messages */}
                {message.type === 'assistant' && message.metadata && !message.isError && (
                  <div className="mt-3 pt-3 border-t border-gray-300/50">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Sources: {message.metadata.num_sources}</span>
                        {message.confidence_score && (
                          <span>Confidence: {(message.confidence_score * 100).toFixed(0)}%</span>
                        )}
                      </div>
                      <div>Language: {message.metadata.detected_language === 'bn' ? 'Bengali' : 'English'}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1 px-2">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="typing-indicator">
                  <div className="typing-dot" style={{'--delay': 0}}></div>
                  <div className="typing-dot" style={{'--delay': 1}}></div>
                  <div className="typing-dot" style={{'--delay': 2}}></div>
                  <span className="ml-2 text-gray-500 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Questions */}
      {messages.length === 1 && (
        <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">নমুনা প্রশ্ন / Sample Questions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-3 bg-white rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors border border-gray-200"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন / Type your question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-bengali"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isLoading ? (
              <div className="w-6 h-6">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            )}
          </button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Powered by Google Gemini • HSC Bangla Literature Dataset
        </div>
      </div>
    </div>
  )
}

export default Chat
