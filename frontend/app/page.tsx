'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import BookCard from '@/components/BookCard';
import BookForm from '@/components/BookForm';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useBooks } from '@/contexts/BookContext';
import { useUI } from '@/contexts/UIContext';

export default function HomePage() {
  const { books, loading, error, searchBooks } = useBooks();
  const {
    showAddModal,
    showEditModal,
    showDeleteModal,
    editingBook,
    deletingBook,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    setEditingBook,
    setDeletingBook,
  } = useUI();
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    return searchQuery.trim() ? searchBooks(searchQuery) : books;
  }, [books, searchQuery, searchBooks]);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingBook(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingBook(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F6F3]">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F3]">
      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <EmptyState 
            isSearching={Boolean(searchQuery.trim())} 
            searchQuery={searchQuery} 
          />
        ) : (
          <>
            {/* Results Header */}
            {searchQuery.trim() && (
              <div className="mb-6">
                <p className="text-[#A6B28B]">
                  Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
              </div>
            )}

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <BookForm
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
      />

      <BookForm
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        book={editingBook}
      />

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        book={deletingBook}
      />
    </div>
  );
}