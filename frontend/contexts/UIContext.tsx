'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book, UIContextType } from '@/types/book';

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const contextValue: UIContextType = {
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
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}