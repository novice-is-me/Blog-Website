import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const EditPost = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContent, setUpdatedContent] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/myPosts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setPosts(data.result);
        });
    }, []);

    const handleShowModal = (post) => {
        setSelectedPost(post);
        setUpdatedTitle(post.title);
        setUpdatedContent(post.content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!selectedPost) return;

        fetch(`${import.meta.env.VITE_API_URL}/posts/updatePost/${selectedPost._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: updatedTitle,
                content: updatedContent
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === "Updated Successfully") {
                Swal.fire({
                    title: 'Post Updated',
                    text: 'The post has been updated',
                    icon: 'success'
                });
                setPosts(posts.map(post => post._id === selectedPost._id ? { ...post, title: updatedTitle, content: updatedContent } : post));
                handleCloseModal();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to update the post',
                    icon: 'error'
                });
            }
        });
    };

    const handleDelete = (postId) => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/deletePost/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === "Deleted Successfully") {
                Swal.fire({
                    title: 'Post Deleted',
                    text: 'The post has been deleted',
                    icon: 'success'
                });
                setPosts(posts.filter(post => post._id !== postId));
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete the post',
                    icon: 'error'
                });
            }
        });
    };

    return (
        <div>
            <Link to="/blog" className="btn btn-primary my-4">Back</Link>
            <h1 className=' text-center my-4'>My Posts</h1>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post._id} className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <strong>{post.title}</strong>
                                <p>{post.content}</p>
                            </div>
                            <div>
                                <Button variant="warning" onClick={() => handleShowModal(post)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(post._id)} className="ms-2">Delete</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found</p>
            )}

            {/* Edit Post Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={updatedContent}
                                onChange={(e) => setUpdatedContent(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditPost;
