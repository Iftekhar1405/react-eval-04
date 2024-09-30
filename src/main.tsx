import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';
import { AuthContextProvider, Login } from './Login';
import BookDetails from './BookDetails'; // Corrected the spelling of BookDetails
import BorrowedBooks from './BorrowedBooks';

// Define the type for the root element if necessary
const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/books/:id' element={<BookDetails />} /> {/* Corrected the spelling here as well */}
        <Route path='/books' element={<BorrowedBooks />} />
      </Routes>
    </BrowserRouter>
  </AuthContextProvider>
);
