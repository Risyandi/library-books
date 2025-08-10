# Library Books - Book Collection CRUD App

A comprehensive book collection management system built with React/Next.js and TypeScript. This application allows users to efficiently manage their personal library with full CRUD (Create, Read, Update, Delete) functionality.

## 🚀 Features

### Core Functionality
- **📚 Dashboard View**: Responsive grid layout displaying all books with thumbnail cards
- **➕ Add Books**: Modal-based form to add new books with validation
- **✏️ Edit Books**: Update existing book information with pre-populated forms
- **👁️ View Details**: Dedicated detailed view for individual books with dynamic routing
- **🗑️ Delete Books**: Confirmation dialog before removing books from collection
- **🔍 Search**: Real-time search functionality across title, author, and genre
- **💾 Data Persistence**: Local storage integration to maintain data between sessions

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **React Context API**: Global state management for books and UI state
- **Form Validation**: Real-time client-side validation with error feedback
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during async operations
- **Modern UI**: Clean, professional design with smooth animations

## 📋 Book Properties

Each book includes the following fields:

### Required Fields
- **Title**: String (minimum 2 characters)
- **Author**: String (minimum 2 characters)  
- **Year**: Number (1000 - current year + 10)

### Optional Fields
- **ISBN**: String
- **Genre**: Dropdown selection from predefined genres
- **Description**: Multi-line text area
- **Cover Image URL**: Valid URL for book cover

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── books/             # Book detail pages
│   │   └── [id]/          # Dynamic routing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── BookCard.tsx       # Individual book card
│   ├── BookForm.tsx       # Add/Edit book modal
│   ├── DeleteConfirmation.tsx # Delete confirmation modal
│   ├── EmptyState.tsx     # Empty state component
│   ├── Header.tsx         # App header with search
│   └── LoadingSpinner.tsx # Loading indicator
├── contexts/              # React Context providers
│   ├── BookContext.tsx    # Book data management
│   └── UIContext.tsx      # UI state management
├── types/                 # TypeScript interfaces
│   └── book.ts           # Book-related types
├── utils/                 # Utility functions
│   └── validation.ts      # Form validation logic
└── README.md             # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 Usage Guide

### Adding a Book
1. Click the "Add Book" button in the header
2. Fill in the required fields (Title, Author, Year)
3. Optionally add ISBN, genre, description, and cover image URL
4. Click "Add Book" to save

### Searching Books
- Use the search bar in the header
- Search works across book titles, authors, and genres
- Results update in real-time as you type

### Editing a Book
1. Click the edit button on any book card (or in detail view)
2. Update the desired fields in the modal form
3. Click "Update Book" to save changes

### Viewing Book Details
- Click the "View" button on any book card
- Or click on the book title to navigate to detailed view
- Use breadcrumb navigation to return to the main library

### Deleting a Book
1. Click the delete button on any book card
2. Confirm deletion in the modal dialog
3. The book will be permanently removed from your collection
   
## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Reading! 📖**