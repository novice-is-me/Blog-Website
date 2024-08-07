import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const navigate = useNavigate();

    const handleAdd = (e) => {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_URL}/posts/addPost`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            Swal.fire({
                title: 'Post Added',
                text: 'Post has been added',
                icon: 'success'
            });

            navigate('/blog');
        })
        .catch(err => {
            console.error("Error adding post:", err);
            Swal.fire({
                title: 'Error',
                text: 'There was an error adding the post',
                icon: 'error'
            });
        });
    };

    return (
        <Form onSubmit={handleAdd}>
            <Link to="/blog" className="btn btn-primary my-4">Back</Link>
            <h1 className="my-4 text-center color-secondary">Add Blog Post</h1>
            <div className="border p-4">
                <Form.Group className="mb-2">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Content:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Button variant="warning my-3" type="submit" id="submitBtn">
                    Submit
                </Button>
            </div>
        </Form>
    );
};

export default AddPost;
