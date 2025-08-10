'use client';

import React, { useState } from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { setShowAddModal } = useUI();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-[#1C352D]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1C352D]">Library Manager</h1>
              <p className="text-sm text-[#A6B28B]">Manage your book collection</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors ${
                  isSearchFocused ? 'text-[#1C352D]' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                         leading-5 bg-white placeholder-gray-500 focus:outline-none 
                         focus:placeholder-gray-400 focus:ring-2 focus:ring-[#1C352D] 
                         focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Add Book Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-lg shadow-sm text-white bg-[#1C352D] 
                     hover:bg-[#2a5240] focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-[#1C352D] transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Book
          </button>
        </div>
      </div>
    </header>
  );
}