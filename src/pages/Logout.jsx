import React from 'react';
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TokenContext } from '../App';

const Logout = () => {
    const { setToken } = useContext(TokenContext);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/login');
    }, [navigate, setToken]);

    return (
        <>
        </>
    ); 
}

export default Logout
