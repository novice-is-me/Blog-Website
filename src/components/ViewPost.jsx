import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { TokenContext } from '../App';

const ViewPost = () => {
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const [comment, setComment] = useState('');

    const navigate = useNavigate();

    const { token } = useContext(TokenContext);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = () => {
        fetch(`https://blog-api-9a4i.onrender.com/posts/getPost/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.result) {
                    console.log("Fetched Post:", data.result);
                    setPost(data.result);
                } else {
                    console.error("Error fetching post:", data);
                }
            })
            .catch(err => console.error("Error:", err));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`https://blog-api-9a4i.onrender.com/posts/addComment/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ comment })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Comment added successfully" && data.result) {
                    console.log("Updated Post:", data.result);
                    setPost(data.result);
                    setComment('');
                    
                    Swal.fire({
                        title: 'Comment Added',
                        text: 'Comment has been added',
                        icon: 'success'
                    }).then(() => {
                        fetchPost(); 
                    });
                } else {
                    console.error("Error updating post:", data);
                }
            })
            .catch(err => console.error("Error:", err));
    }

    return (
        <div>
            <Link to='/blog' className='btn btn-primary my-4'>Back</Link>
            <h1 className=' text-center my-3'>VIEW POST</h1>
            {post ? (
                <div className='border p-4'>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <p>Author ID: {post.author}</p>
                   {token ?
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text"
                                placeholder="Add Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    : <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="text"
                                placeholder="Login First"
                                value={comment}
                                readOnly
                                onChange={(e) => setComment(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled>
                            Submit
                        </Button>
                    </Form>
                    }
                    {post.comments && post.comments.length > 0 && (
                        <div className='mt-4'>
                            <h4>Comments:</h4>
                            <ul>
                                {post.comments.map((comment) => (
                                    <li key={comment._id}>{comment.comment}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ViewPost;
