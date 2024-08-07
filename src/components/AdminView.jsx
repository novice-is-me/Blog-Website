import React, { useEffect, useState } from 'react';
import { Button, Modal, ListGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AdminView = () => {
    const [posts, setPosts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [remove, setRemove] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/getPosts`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPosts(data.result);
            });
    }, []);

    const handleDeletePost = (postId) => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/deletePostByAdmin/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === "Post deleted successfully") {
                Swal.fire({
                    title: 'Post Deleted',
                    text: 'The post has been deleted',
                    icon: 'success'
                });
                setPosts(posts.filter(post => post._id !== postId));
                setShowDeleteModal(false);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete the post',
                    icon: 'error'
                });
            }
        });
    };

    const handleRemoveComment = (postId, commentId) => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/deleteComment/${postId}/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === "Comment deleted successfully") {
                Swal.fire({
                    title: 'Comment Deleted',
                    text: 'The comment has been deleted',
                    icon: 'success'
                });
                setPosts(posts.map(post => 
                    post._id === postId ? {
                        ...post,
                        comments: post.comments.filter(comment => comment._id !== commentId)
                    } : post
                ));
                setRemove(false);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete the comment',
                    icon: 'error'
                });
            }
        });
    };

    return (
        <div>
            <h1 className=' text-center my-4'>Admin View</h1>
            <h4 className=' text-uppercase mb-4'>Posts Available</h4>
            {posts.length > 0 ? (
                <ListGroup>
                    {posts.map(post => (
                        <ListGroup.Item key={post._id} className="mb-3 border border-primary p-5">
                            <div className=' d-flex justify-content-between'>
                               <div>
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                               </div>
                                <Button variant="danger" onClick={() => { setSelectedPost(post); setShowDeleteModal(true); }}>Delete</Button>
                            </div>
                            <div className="mt-3">
                                <h5>Comments:</h5>
                                {post.comments && post.comments.length > 0 ? (
                                    <ListGroup>
                                        {post.comments.map(comment => (
                                            <ListGroup.Item key={comment._id} className=' d-flex justify-content-between'>
                                                <p>{comment.comment}</p>
                                                <Button variant="danger" onClick={() => { setSelectedPost(post); setSelectedComment(comment); setRemove(true); }}>Remove</Button>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>No comments</p>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>No posts found</p>
            )}

            {/* Delete Post Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the post titled "{selectedPost?.title}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeletePost(selectedPost?._id)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Remove Comment Modal */}
            <Modal show={remove} onHide={() => setRemove(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Comment Removal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this comment?
                    <p>{selectedComment?.comment}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setRemove(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleRemoveComment(selectedPost?._id, selectedComment?._id)}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminView;
