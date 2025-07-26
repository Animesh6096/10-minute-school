import React, { useState } from 'react'
import Logo from '../assets/logo.svg'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="flex items-center">
              <img 
                src={Logo} 
                alt="10 Minute School Logo" 
                className="h-8 sm:h-10 w-auto"
              />
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="কিছু খোঁজ করুন..."
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile Search Icon */}
          <div className="md:hidden flex items-center">
            <button className="p-2 text-gray-700 hover:text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>ক্লাস ৯-১২</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>বিজ্ঞান</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <span className="text-green-600 font-medium cursor-pointer hover:text-green-700">
              ফ্রি পরীক্ষা
            </span>

            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>অ্যাডমিশন ব্যাচ</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>স্কিল সেকশন</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-600 cursor-pointer">
              <span>আরো</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <span className="text-blue-600 font-medium text-xs sm:text-sm">EN</span>
            
            <div className="flex items-center space-x-1 text-gray-700 text-xs sm:text-sm">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>16910</span>
            </div>

            <button className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors">
              লগ-ইন
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <div className="w-5 h-5 relative flex flex-col justify-center items-center">
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <img 
                src={Logo} 
                alt="10 Minute School Logo" 
                className="h-8 w-auto"
              />
              <button 
                onClick={toggleMobileMenu}
                className="p-1 text-white hover:text-red-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="কিছু খোঁজ করুন..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-2.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <button className="flex items-center justify-between w-full text-left text-gray-700 hover:text-red-600 transition-colors">
                  <span className="text-sm font-medium">ক্লাস ৯-১২</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="flex items-center justify-between w-full text-left text-gray-700 hover:text-red-600 transition-colors">
                  <span className="text-sm font-medium">বিজ্ঞান</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="text-left text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                  ফ্রি পরীক্ষা
                </button>

                <button className="flex items-center justify-between w-full text-left text-gray-700 hover:text-red-600 transition-colors">
                  <span className="text-sm font-medium">অ্যাডমিশন ব্যাচ</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="flex items-center justify-between w-full text-left text-gray-700 hover:text-red-600 transition-colors">
                  <span className="text-sm font-medium">স্কিল সেকশন</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="flex items-center justify-between w-full text-left text-gray-700 hover:text-red-600 transition-colors">
                  <span className="text-sm font-medium">আরো</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <button className="text-sm font-medium text-blue-600">EN</button>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">16910</span>
                </div>

                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  লগ-ইন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Navigation - Responsive */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 py-2 sm:py-3 text-xs sm:text-sm">
            <div className="text-red-600 font-semibold bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-center">
              🤖 HSC বাংলা সাহিত্য AI চ্যাট বট
            </div>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="text-gray-600 text-center">বাংলা ও ইংরেজি উভয় ভাষায় প্রশ্ন করুন</span>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="text-gray-600 text-center">Google Gemini AI দ্বারা চালিত</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
