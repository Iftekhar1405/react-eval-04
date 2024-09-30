import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './Register.jsx'
import {AuthContextProvider, Login} from './Login.jsx'
import BookDtails from './BookDetails.js'
import BorrowedBooks from './BorrowedBooks.js'



const root = createRoot(document.getElementById('root'))

root.render(
<AuthContextProvider>
  <BrowserRouter>
  <Routes>
    
    <Route path='/' element={<App/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/books/:id' element={<BookDtails/>}/>
    <Route path='books' element={<BorrowedBooks/>}/>

  </Routes>
  </BrowserRouter>
  </AuthContextProvider>

)
