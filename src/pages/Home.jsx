import React, { useContext } from 'react'
import { TokenContext } from '../App'
import { Link } from 'react-router-dom'

const Home = () => {

  const { token } = useContext(TokenContext);

  return (
    <div className=' text-center my-4 d-flex align-items-center justify-content-center' 
    id='hero'>
          <div>
              <h1>Welcome To Blog System Website</h1>
                <Link to="/blog" className="btn btn-primary my-4">See Posts</Link>
          </div>
    </div>
  )
}

export default Home
