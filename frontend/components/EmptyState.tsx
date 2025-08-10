'use client';

import React from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

interface EmptyStateProps {
  isSearching?: boolean;
  searchQuery?: string;
}

export default function EmptyState({ isSearching = false, searchQuery = '' }: EmptyStateProps) {
  const { setShowAddModal } = useUI();

  if (isSearching) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-600 mb-6">
          No books match your search for <strong>"{searchQuery}"</strong>
        </p>
        <p className="text-sm text-gray-500">
          Try adjusting your search terms or browse all books
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No books in your library</h3>
      <p className="text-gray-600 mb-6">
        Get started by adding your first book to the collection
      </p>
      <button
        onClick={() => setShowAddModal(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#1C352D] hover:bg-[#2a5240] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C352D] transition-colors duration-200"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Your First Book
      </button>
    </div>
  );
}