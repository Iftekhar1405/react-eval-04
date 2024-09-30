import  { useContext } from "react";
import { BorrowContext } from "./BorrowContext";

// Adjust the import based on your file structure

const BorrowedBooks = () => {
  const { borrowedBooks, returnBook } = useContext(BorrowContext);

  return (
    <div>
      <h2>Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>No books borrowed at the moment.</p>
      ) : (
        <ul>
          {borrowedBooks.map((book) => (
            <li key={book.id}>
              <img src={book.coverImage} alt={`${book.title} cover`} style={{ width: "50px", height: "75px", marginRight: "10px" }} />
              <span>{book.title}</span>
              <span> by {book.author}</span>
              <button onClick={() => returnBook(book.id)} style={{ marginLeft: "10px" }}>
                Return
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowedBooks;
