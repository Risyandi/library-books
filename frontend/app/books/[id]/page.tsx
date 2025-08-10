'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Hash, Tag, Edit, Trash2 } from 'lucide-react';
import { useBooks } from '@/contexts/BookContext';
import { useUI } from '@/contexts/UIContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import BookForm from '@/components/BookForm';
import DeleteConfirmation from '@/components/DeleteConfirmation';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getBookById } = useBooks();
  const {
    showEditModal,
    showDeleteModal,
    editingBook,
    deletingBook,
    setShowEditModal,
    setShowDeleteModal,
    setEditingBook,
    setDeletingBook,
  } = useUI();

  const bookId = params.id as string;
  const book = getBookById(bookId);

  const handleEdit = () => {
    if (book) {
      setEditingBook(book);
      setShowEditModal(true);
    }
  };

  const handleDelete = () => {
    if (book) {
      setDeletingBook(book);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setDeletingBook(null);
    router.push('/');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingBook(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingBook(null);
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Book Not Found</h2>
            <p className="text-gray-600 mb-6">The book you're looking for doesn't exist.</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#1C352D] hover:bg-[#2a5240] transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F3]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="inline-flex items-center text-[#1C352D] hover:text-[#2a5240] transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Library</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="relative h-96 md:h-full bg-gradient-to-br from-[#F9F6F3] to-[#F5C9B0]">
                {book.coverImageUrl ? (
                  <Image
                    src={book.coverImageUrl}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-32 bg-[#1C352D] rounded-lg mb-4 mx-auto opacity-20"></div>
                      <p className="text-[#A6B28B] font-medium">No Cover Available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Information */}
            <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
              {/* Title and Author */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#1C352D] mb-2">
                  {book.title}
                </h1>
                <div className="flex items-center text-xl text-[#A6B28B] mb-4">
                  <User className="h-5 w-5 mr-2" />
                  <span>{book.author}</span>
                </div>
                
                {book.genre && (
                  <span className="inline-block bg-[#F5C9B0] text-[#1C352D] px-3 py-1 rounded-full text-sm font-medium">
                    {book.genre}
                  </span>
                )}
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-[#A6B28B]" />
                  <div>
                    <p className="text-sm text-gray-500">Publication Year</p>
                    <p className="font-medium">{book.year}</p>
                  </div>
                </div>

                {book.isbn && (
                  <div className="flex items-center text-gray-700">
                    <Hash className="h-5 w-5 mr-3 text-[#A6B28B]" />
                    <div>
                      <p className="text-sm text-gray-500">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                  </div>
                )}

                {book.genre && (
                  <div className="flex items-center text-gray-700">
                    <Tag className="h-5 w-5 mr-3 text-[#A6B28B]" />
                    <div>
                      <p className="text-sm text-gray-500">Genre</p>
                      <p className="font-medium">{book.genre}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1C352D] mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 space-y-1 sm:space-y-0">
                  <p>Added: {new Date(book.createdAt).toLocaleDateString()}</p>
                  {book.createdAt !== book.updatedAt && (
                    <p>Last updated: {new Date(book.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
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