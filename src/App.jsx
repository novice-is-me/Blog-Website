import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Blog from './pages/Blog';
import ViewPost from './components/ViewPost';
import AddPost from './components/AddPost';
import EditPost from './components/EditPost';
import AdminView from './components/AdminView';

export const TokenContext = createContext();

function App() {

  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const tokenStored = localStorage.getItem('token');
    if (tokenStored) {
      setToken(tokenStored);
      const decodedToken = jwtDecode(tokenStored);
      console.log('Decoded Token:', decodedToken); 
      setIsAdmin(decodedToken.isAdmin === true);
    }
  }, []);

  useEffect(() =>{
    console.log('Token:', token);
    console.log('isAdmin:', isAdmin);
  });

  return (
    <Router>
      <TokenContext.Provider value={{ token, setToken, isAdmin, setIsAdmin }}>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='/blog' element={<Blog/>}/>
            <Route path='/viewPost/:id' element={<ViewPost/>}/>
            <Route path='/addPost' element={<AddPost/>}/>
            <Route path='/myPosts' element={<EditPost/>}/>
            <Route path='/adminView' element={<AdminView/>}/>
            {/* Add other routes here */}
          </Routes>
        </Container>
      </TokenContext.Provider>
    </Router>
  );
}

export default App;
