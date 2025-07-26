import React from 'react'
import Logo from '../assets/logo.svg'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={Logo} 
                alt="10 Minute School Logo" 
                className="h-12 w-auto footer-logo"
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              বাংলাদেশের সবচেয়ে বড় অনলাইন শিক্ষা প্ল্যাটফর্ম। HSC, SSC, ভর্তি পরীক্ষা এবং স্কিল ডেভেলপমেন্টের জন্য সম্পূর্ণ সমাধান।
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white">HSC কোর্স</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">SSC কোর্স</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">ভর্তি পরীক্ষা</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">স্কিল কোর্স</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">ফ্রি কন্টেন্ট</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">সাপোর্ট</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white">যোগাযোগ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">সাহায্য কেন্দ্র</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">শর্তাবলী</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">গোপনীয়তা নীতি</a></li>
              <li className="flex items-center text-green-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                16910
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © ২০২৫ 10 Minute School. সকল অধিকার সংরক্ষিত।
          </div>
          <div className="text-sm text-gray-400 mt-2 md:mt-0">
            AI চ্যাটবট দ্বারা চালিত | HSC বাংলা সাহিত্য
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
