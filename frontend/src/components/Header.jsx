import React from 'react'

const Header = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        বহুভাষিক RAG সিস্টেম
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-2">
        Multilingual RAG System
      </h2>
      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        বাংলা ও ইংরেজি প্রশ্নের উত্তর দিতে পারে এমন একটি উন্নত প্রশ্নোত্তর সিস্টেম
        <br />
        <span className="text-base opacity-75">
          Advanced Q&A system that can answer questions in Bengali and English
        </span>
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-white/70">
        <span className="px-3 py-1 bg-white/20 rounded-full">HSC Bangla Literature</span>
        <span className="px-3 py-1 bg-white/20 rounded-full">Multilingual Support</span>
        <span className="px-3 py-1 bg-white/20 rounded-full">AI Powered</span>
      </div>
    </div>
  )
}

export default Header
