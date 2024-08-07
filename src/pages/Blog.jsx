import React, { useContext, useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard';
import { Button } from 'react-bootstrap';
import { TokenContext } from '../App';
import AdminView from '../components/AdminView';

const Blog = () => {

    const { isAdmin, token } = useContext(TokenContext);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/posts/getPosts`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setPosts(data.result);
        });
    },[])

  return (
    <>
        {isAdmin ?
            <AdminView/> 
            :
            <div className=' my-5'> 
                <h1 className=' text-center mb-5 text-warning text-uppercase'>Hottest Blog Today</h1>
                { token ? 
                    <div className='d-flex justify-content-center gap-4 my-3'>
                    <Button href='/addPost' className='btn btn-primary'>Add Post</Button>
                    <Button href='/myPosts' className='btn btn-primary'>View My Posts</Button>
                    </div>
                :<></>}
                <div className=' d-flex flex-column gap-4'>
                    {posts.map((post, i)=>{
                        return (
                            <div key={i}>
                                <BlogCard post={post} postId={post._id}/>
                            </div>
                        )
                    })}
                </div>
            </div>    
        }
    </>
  ) 
}

export default Blog
