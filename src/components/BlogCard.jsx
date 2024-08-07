import React from 'react'
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const BlogCard = ({post, postId}) => {
    console.log(post);
    const { title, author } = post;
  return (
    <Card>
        <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>Author ID: {author}</Card.Text>
        <Button variant="primary" as={Link} to={`/viewPost/${postId}`}>View More</Button>
        </Card.Body>
  </Card>
  )
}

export default BlogCard
