import React, { useState, useEffect, useContext } from 'react'; // Combined import statement
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { TokenContext } from '../App';

const Login = () => { 
  const { setToken, setIsAdmin } = useContext(TokenContext); // Added setIsAdmin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if(data.access !== undefined) {
        setEmail('');
        setPassword('');
        localStorage.setItem('token', data.access);
        setToken(data.access);
        
        const decodedToken = jwtDecode(data.access); // Decode the token immediately after setting it
        setIsAdmin(decodedToken.isAdmin === true); // Set isAdmin state based on decoded token

        Swal.fire({
          title: 'Login Successful',
          text: "You're now logged in",
          icon: 'success'
        });

        navigateBasedOnRole(decodedToken.isAdmin); // Navigate based on role
      } else if(data.message === "Email and password do not match") {
        Swal.fire({
          title: 'Login Failed',
          text: 'Inputs do not match',
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'User Not Found',
          text: `${email} does not exist`,
          icon: 'error'
        });
      }
    });
  };

  const navigateBasedOnRole = (isAdmin) => { // Function to navigate based on role
    if (isAdmin) {
      navigate('/adminView');
    } else {
      navigate('/blog');
    }
  };

  useEffect(() => {
    if(email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (  
    <>
      <h1 className="my-5 text-center color-secondary">Login</h1>
      <Form onSubmit={handleLogin} className='border p-3'> {/* Changed to handleLogin */}
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        
        { isActive ? 
          <Button variant="primary" type="submit" id="loginBtn">
            Login
          </Button>
          : 
          <Button variant="danger" type="submit" id="loginBtn" disabled>
            Login
          </Button>
        } 
      </Form> 
    </>
  );
};

export default Login;
