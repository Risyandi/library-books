'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Book } from '@/types/book';
import { useBooks } from '@/contexts/BookContext';
import { useUI } from '@/contexts/UIContext';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export default function DeleteConfirmation({ isOpen, onClose, book }: DeleteConfirmationProps) {
  const { deleteBook } = useBooks();
  const { setDeletingBook } = useUI();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!book) return;

    setIsDeleting(true);
    try {
      deleteBook(book.id);
      setDeletingBook(null);
      onClose();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Book</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this book? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
            <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600">by {book.author} ({book.year})</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isDeleting ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      </div>
    </div>
  );
}