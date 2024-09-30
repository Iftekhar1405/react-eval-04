import  {
    useState,
    ChangeEvent,
    FormEvent,
    useMemo,
    useContext,
  } from "react";
  import axios from "axios";
  import { Link } from "react-router-dom";
  import { BorrowContext } from "./BorrowContext";
  
  // Define types for the book data
  export interface Book {
    id: string;
    title: string;
    author: string;
    publicationDate: string;
    synopsis: string;
    genre: string;
    coverImage: string;
  }
  
  const Books = () => {
    const [data, setData] = useState<Book[]>([]);
    const [query, setQuery] = useState<string>("");
    const [darkTheme, setDarkTheme] = useState<boolean>(true);
    const [showMoreId, setShowMoreId] = useState<string | null>(null);
    const [addBook, setAddBook] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [publicationDate, setPublicationDate] = useState<string>("");
    const [synopsis, setSynopsis] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [coverImage, setCoverImage] = useState<string>("");
    const [editingBookId, setEditingBookId] = useState<string | null>(null);
  
    const { borrowedBooks, borrowBook, returnBook } = useContext(BorrowContext);
  
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://react-db--01-default-rtdb.asia-southeast1.firebasedatabase.app/books.json"
        );
        const booksArray: Book[] = Object.keys(res.data).map((key) => ({
          id: key,
          ...res.data[key],
        }));
        setData(booksArray);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };
  
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    };
  
    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      const newBook: Omit<Book, "id"> = {
        title,
        author,
        publicationDate,
        coverImage,
        synopsis,
        genre,
      };
      await axios.post(
        "https://react-db--01-default-rtdb.asia-southeast1.firebasedatabase.app/books.json",
        newBook
      );
      fetchData();
      alert("New book added");
      setTitle("");
      setAuthor("");
      setPublicationDate("");
      setSynopsis("");
      setGenre("");
      setCoverImage("");
    };
  
    const handleDelete = async (id: string) => {
      await axios.delete(
        `https://react-db--01-default-rtdb.asia-southeast1.firebasedatabase.app/books/${id}.json`
      );
      fetchData();
      alert("Book deleted");
    };
  
    const handleEditToggle = (id: string) => {
      setEditingBookId(editingBookId === id ? null : id);
    };
  
    const handleUpdate = async (id: string, updatedBook: Book) => {
      await axios.put(
        `https://react-db--01-default-rtdb.asia-southeast1.firebasedatabase.app/books/${id}.json`,
        updatedBook
      );
      fetchData();
      alert("Book updated");
      setEditingBookId(null);
    };
  
    // Memoize filtered data based on `data` and `query`
    const filteredData = useMemo(() => {
      return data.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.genre.toLowerCase().includes(query.toLowerCase()) ||
          book.publicationDate === query
      );
    }, [data, query]);
  
    const toggleShowMore = (id: string) => {
      setShowMoreId(showMoreId === id ? null : id);
    };
  
    return (
      <div className={darkTheme ? "light" : "dark"}>
        <label htmlFor="darkmode-toggle">
          Darkmode
          <input
            id="darkmode-toggle"
            type="checkbox"
            onChange={() => setDarkTheme(!darkTheme)}
          />
        </label>
  
        <button onClick={fetchData}>Get All Books</button>
        <input
          type="text"
          placeholder="Search by title, author, or genre"
          value={query}
          onChange={handleSearch}
        />
  
        <button onClick={() => setAddBook(!addBook)}>
          {addBook ? "Done" : "Add Book"}
        </button>
  
        {addBook && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Publication Date"
              value={publicationDate}
              onChange={(event) => setPublicationDate(event.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Synopsis"
              value={synopsis}
              onChange={(event) => setSynopsis(event.target.value)}
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        )}
  
        <select
          onChange={(event) => setQuery(event.target.value)}
          value={query}
        >
          <option value="">Select by genre</option>
          {data.map((book) => (
            <option key={book.id} value={book.genre}>
              {book.genre}
            </option>
          ))}
        </select>
  
        <select
          onChange={(event) => setQuery(event.target.value)}
          value={query}
        >
          <option value="">Select by date</option>
          {data.map((book) => (
            <option key={book.id} value={book.publicationDate}>
              {book.publicationDate}
            </option>
          ))}
        </select>
  
        <div className="cont">
          {filteredData.map((book) => {
            const isBorrowed = borrowedBooks.some((b) => b.id === book.id);
            const canBorrowMore = borrowedBooks.length < 2;
  
            return (
              <div key={book.id}>
                <Link
                  to={`/books/${book.id}`}
                  style={{ textDecoration: "none", color: "red" }}
                >
                  <img src={book.coverImage} alt="Book cover" />
                  <p>{book.title}</p>
                  <p>{book.author}</p>
                  <p>{book.genre}</p>
                </Link>
                {!isBorrowed && (
                  <button
                    onClick={() => borrowBook(book)}
                    disabled={!canBorrowMore}
                  >
                    Borrow
                  </button>
                )}
                {isBorrowed && (
                  <button onClick={() => returnBook(book.id)}>Return</button>
                )}
                <button onClick={() => handleDelete(book.id)}>Delete</button>
                <button onClick={() => handleEditToggle(book.id)}>
                  {editingBookId === book.id ? "Cancel" : "Edit"}
                </button>
  
                {editingBookId === book.id && (
                  <>
                    <input
                      type="text"
                      value={book.title}
                      onChange={(event) =>
                        setData((prevData) =>
                          prevData.map((b) =>
                            b.id === book.id
                              ? { ...b, title: event.target.value }
                              : b
                          )
                        )
                      }
                    />
                    <input
                      type="text"
                      value={book.publicationDate}
                      onChange={(event) =>
                        setData((prevData) =>
                          prevData.map((b) =>
                            b.id === book.id
                              ? { ...b, publicationDate: event.target.value }
                              : b
                          )
                        )
                      }
                    />
                    <input
                      type="text"
                      value={book.author}
                      onChange={(event) =>
                        setData((prevData) =>
                          prevData.map((b) =>
                            b.id === book.id
                              ? { ...b, author: event.target.value }
                              : b
                          )
                        )
                      }
                    />
                    <input
                      type="text"
                      value={book.genre}
                      onChange={(event) =>
                        setData((prevData) =>
                          prevData.map((b) =>
                            b.id === book.id
                              ? { ...b, genre: event.target.value }
                              : b
                          )
                        )
                      }
                    />
                    <input
                      type="text"
                      value={book.synopsis}
                      onChange={(event) =>
                        setData((prevData) =>
                          prevData.map((b) =>
                            b.id === book.id
                              ? { ...b, synopsis: event.target.value }
                              : b
                          )
                        )
                      }
                    />
                    <input
                      type="text"
                      value={book.coverImage}
                      onChange={(event) =>
                        setData((prevData) =>
                          prevData.map((b) =>
                            b.id === book.id
                              ? { ...b, coverImage: event.target.value }
                              : b
                          )
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        handleUpdate(book.id, {
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          publicationDate: book.publicationDate,
                          genre: book.genre,
                          synopsis: book.synopsis,
                          coverImage: book.coverImage,
                        })
                      }
                    >
                      Save
                    </button>
                  </>
                )}
  
                <button onClick={() => toggleShowMore(book.id)}>
                  {showMoreId === book.id ? "Show less" : "Show More"}
                </button>
                {showMoreId === book.id && <p>{book.synopsis}</p>}
              </div>
            );
          })}
        </div>
  
        <h2>Borrowed Books</h2>
        {borrowedBooks.length === 0 && <p>No books borrowed.</p>}
        {borrowedBooks.map((book) => (
          <div key={book.id}>
            <p>
              <strong>{book.title}</strong> by {book.author}
            </p>
            <button onClick={() => returnBook(book.id)}>Return</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default Books;
  