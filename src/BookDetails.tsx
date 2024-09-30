import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Define the structure of the book data
interface Book {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  synopsis: string;
  coverImage: string;
}

const BookDetails: React.FC = () => {
  const [data, setData] = useState<Book | null>(null); // State to store the book data
  const [error, setError] = useState<string | null>(null); // State for error handling
  const { id } = useParams<{ id: string }>(); // useParams typed with expected parameter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<Book>(
          `https://react-db--01-default-rtdb.asia-southeast1.firebasedatabase.app/books/${Number(id) - 1}.json`
        );
        
        if (res.data) {
          setData(res.data);
        } else {
          setError("No book data found.");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
        setError("Error fetching book data.");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (error) return <p>{error}</p>; 
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <p>Title: {data.title || "N/A"}</p>
      <p>Author: {data.author || "N/A"}</p>
      <p>Genre: {data.genre || "N/A"}</p>
      <p>Book ID: {id}</p>
      <p>Publication Date: {data.publicationDate || "N/A"}</p>
      <p>Synopsis: {data.synopsis || "N/A"}</p>
      {data.coverImage ? (
        <img src={data.coverImage} alt={data.title} />
      ) : (
        <p>No cover image available</p>
      )}
    </>
  );
};

export default BookDetails;
