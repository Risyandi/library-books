'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Book, BookContextType } from '@/types/book';

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

type BookAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string };

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

function bookReducer(state: BookState, action: BookAction): BookState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
      };
    default:
      return state;
  }
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  // Load books from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const savedBooks = localStorage.getItem('library-books');
      if (savedBooks) {
        const books = JSON.parse(savedBooks);
        dispatch({ type: 'SET_BOOKS', payload: books });
      } else {
        // Initialize with some sample data
        const sampleBooks: Book[] = [
          {
            id: '1',
            title: 'The Passion within',
            author: 'Harper Lee',
            year: 1960,
            genre: 'Fiction',
            description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
            isbn: '978-0-06-112008-4',
            coverImageUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Graphic Design',
            author: 'George Orwell',
            year: 1949,
            genre: 'Dystopian Fiction',
            description: 'A dystopian social science fiction novel that explores themes of totalitarianism, mass surveillance, and repressive regimentation.',
            isbn: '978-0-452-28423-4',
            coverImageUrl: 'https://images.pexels.com/photos/3747266/pexels-photo-3747266.jpeg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        dispatch({ type: 'SET_BOOKS', payload: sampleBooks });
        localStorage.setItem('library-books', JSON.stringify(sampleBooks));
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load books from storage' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    if (state.books.length > 0) {
      localStorage.setItem('library-books', JSON.stringify(state.books));
    }
  }, [state.books]);

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBook: Book = {
        ...bookData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_BOOK', payload: newBook });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add book' });
    }
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    try {
      const existingBook = state.books.find(book => book.id === id);
      if (!existingBook) {
        dispatch({ type: 'SET_ERROR', payload: 'Book not found' });
        return;
      }

      const updatedBook: Book = {
        ...existingBook,
        ...bookData,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update book' });
    }
  };

  const deleteBook = (id: string) => {
    try {
      dispatch({ type: 'DELETE_BOOK', payload: id });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete book' });
    }
  };

  const getBookById = (id: string): Book | undefined => {
    return state.books.find(book => book.id === id);
  };

  const searchBooks = (query: string): Book[] => {
    if (!query.trim()) return state.books;
    
    const lowerQuery = query.toLowerCase();
    return state.books.filter(
      book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genre?.toLowerCase().includes(lowerQuery)
    );
  };

  const contextValue: BookContextType = {
    books: state.books,
    loading: state.loading,
    error: state.error,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    searchBooks,
  };

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}