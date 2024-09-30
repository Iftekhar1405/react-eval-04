import React, { createContext, useState } from 'react';

// Define types for the book data
interface Book {
  id: string;
  title: string;
  author: string;
  publicationDate: string;
  synopsis: string;
  genre: string;
  coverImage: string;
}

interface BorrowContextType {
  borrowedBooks: Book[];
  borrowBook: (book: Book) => void;
  returnBook: (bookId: string) => void;
}

export const BorrowContext = createContext<BorrowContextType>({
  borrowedBooks: [],
  borrowBook: () => {},
  returnBook: () => {},
});

export const BorrowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);

  const borrowBook = (book: Book) => {
    if (borrowedBooks.length < 2 && !borrowedBooks.find(b => b.id === book.id)) {
      setBorrowedBooks([...borrowedBooks, book]);
    } else if (borrowedBooks.length >= 2) {
      alert('Cannot borrow more than 2 books at the same time.');
    }
  };

  const returnBook = (bookId: string) => {
    setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId));
  };

  return (
    <BorrowContext.Provider value={{ borrowedBooks, borrowBook, returnBook }}>
      {children}
    </BorrowContext.Provider>
  );
};
