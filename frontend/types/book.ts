export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  isbn?: string;
  genre?: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  year: number | '';
  isbn: string;
  genre: string;
  description: string;
  coverImageUrl: string;
}

export interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, bookData: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
  searchBooks: (query: string) => Book[];
}

export interface UIContextType {
  showAddModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  editingBook: Book | null;
  deletingBook: Book | null;
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  setEditingBook: (book: Book | null) => void;
  setDeletingBook: (book: Book | null) => void;
}

export interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
}