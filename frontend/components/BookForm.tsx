'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Book, Upload } from 'lucide-react';
import { Book as BookType, BookFormData, FormErrors } from '@/types/book';
import { validateBookForm, isValidUrl } from '@/utils/validation';
import { useBooks } from '@/contexts/BookContext';
import { useUI } from '@/contexts/UIContext';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book?: BookType | null;
}

const initialFormData: BookFormData = {
  title: '',
  author: '',
  year: '',
  isbn: '',
  genre: '',
  description: '',
  coverImageUrl: '',
};

export default function BookForm({ isOpen, onClose, book }: BookFormProps) {
  const { addBook, updateBook } = useBooks();
  const { setEditingBook } = useUI();
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string>('');

  const isEditing = Boolean(book);

  useEffect(() => {
    if (isOpen && book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year,
        isbn: book.isbn || '',
        genre: book.genre || '',
        description: book.description || '',
        coverImageUrl: book.coverImageUrl || '',
      });
    } else if (isOpen && !book) {
      setFormData(initialFormData);
    }
    setErrors({});
    setUrlError('');
  }, [isOpen, book]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Validate URL in real-time
    if (name === 'coverImageUrl') {
      if (value && !isValidUrl(value)) {
        setUrlError('Please enter a valid URL');
      } else {
        setUrlError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateBookForm(formData);
    
    if (formData.coverImageUrl && !isValidUrl(formData.coverImageUrl)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        year: Number(formData.year),
        isbn: formData.isbn.trim() || undefined,
        genre: formData.genre.trim() || undefined,
        description: formData.description.trim() || undefined,
        coverImageUrl: formData.coverImageUrl.trim() || undefined,
      };

      if (isEditing && book) {
        updateBook(book.id, bookData);
        setEditingBook(null);
      } else {
        addBook(bookData);
      }

      onClose();
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const commonGenres = [
    'Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Thriller', 'Biography', 'History', 'Self-help', 
    'Poetry', 'Drama', 'Adventure', 'Horror', 'Comedy'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Book className="h-6 w-6 text-[#1C352D]" />
            <h2 className="text-xl font-semibold text-[#1C352D]">
              {isEditing ? 'Edit Book' : 'Add New Book'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#1C352D] focus:border-transparent'
              }`}
              placeholder="Enter book title"
            />
            {errors.title && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.author
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#1C352D] focus:border-transparent'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.author}
              </div>
            )}
          </div>

          {/* Year and Genre Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1000"
                max={new Date().getFullYear() + 10}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  errors.year
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1C352D] focus:border-transparent'
                }`}
                placeholder="2024"
              />
              {errors.year && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.year}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C352D] focus:border-transparent transition-colors duration-200"
              >
                <option value="">Select a genre</option>
                {commonGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ISBN */}
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C352D] focus:border-transparent transition-colors duration-200"
              placeholder="978-0-123456-78-9"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="coverImageUrl"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  urlError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1C352D] focus:border-transparent'
                }`}
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>
            {urlError && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {urlError}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C352D] focus:border-transparent transition-colors duration-200 resize-none"
              placeholder="Brief description of the book..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C352D] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Boolean(urlError)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1C352D] border border-transparent rounded-lg hover:bg-[#2a5240] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C352D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}