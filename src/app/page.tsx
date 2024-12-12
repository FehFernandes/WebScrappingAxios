"use client";

import React, { useEffect, useState } from 'react';
import { Search, Menu, X, Clock, ChevronRight, Bookmark, Share2 } from 'lucide-react';

type NewsItem = {
  title: string;
  link: string;
  imageUrl?: string;
  publishedAt?: string;
  category?: string;
  summary?: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data.news);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                 Hacker News
                </h1>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">LIVE</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 inset-x-0 z-10 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => (
            <article
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {item.imageUrl && (
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Bookmark size={16} className="text-gray-700" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Share2 size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {item.category || 'General'}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={14} className="mr-1" />
                    <span>{item.publishedAt || 'Today'}</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>
                {item.summary && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.summary}</p>
                )}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                >
                  Read full story
                  <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No news found matching your search criteria.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">
               by{' '}
              <a
                href="https://news.ycombinator.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Hacker News.
              </a>

            </p>
            <p className="text-gray-500">Built by {' '}
            <a
                href="https://www.linkedin.com/in/felipe-fernandessa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Felipe
              </a>
            </p>

           
          </div>
        </div>
      </footer>
    </div>
  );
}
