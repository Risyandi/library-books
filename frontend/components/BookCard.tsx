'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Edit, Trash2, Calendar, User } from 'lucide-react';
import { Book } from '@/types/book';
import { useUI } from '@/contexts/UIContext';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { setShowEditModal, setShowDeleteModal, setEditingBook, setDeletingBook } = useUI();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingBook(book);
    setShowEditModal(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setDeletingBook(book);
    setShowDeleteModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Book Cover */}
      <div className="relative h-48 bg-gradient-to-br from-[#F9F6F3] to-[#F5C9B0]">
        {book.coverImageUrl ? (
          <Image
            src={book.coverImageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-20 bg-[#1C352D] rounded-sm mb-2 mx-auto opacity-20"></div>
              <p className="text-[#A6B28B] text-sm font-medium">No Cover</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-2">
            <Link href={`/books/${book.id}`}>
              <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200 shadow-sm">
                <Eye className="h-4 w-4 text-[#1C352D]" />
              </button>
            </Link>
            <button
              onClick={handleEdit}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <Edit className="h-4 w-4 text-[#A6B28B]" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-[#1C352D] text-lg leading-tight line-clamp-2 mb-1">
            {book.title}
          </h3>
          <div className="flex items-center text-[#A6B28B] text-sm mb-2">
            <User className="h-4 w-4 mr-1" />
            <span className="truncate">{book.author}</span>
          </div>
          <div className="flex items-center text-[#A6B28B] text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{book.year}</span>
            {book.genre && (
              <>
                <span className="mx-2">•</span>
                <span className="bg-[#F5C9B0] text-[#1C352D] px-2 py-1 rounded-full text-xs font-medium">
                  {book.genre}
                </span>
              </>
            )}
          </div>
        </div>

        {book.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {book.description}
          </p>
        )}

        {/* Action Buttons for Mobile */}
        <div className="flex space-x-2 sm:hidden">
          <Link href={`/books/${book.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-[#1C352D] bg-[#F9F6F3] rounded-lg hover:bg-[#F5C9B0] transition-colors duration-200">
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
          </Link>
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-[#A6B28B] bg-[#F9F6F3] rounded-lg hover:bg-[#F5C9B0] transition-colors duration-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}