import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/users/register">Register</Link></li>
          <li><Link to="/users/login">Login</Link></li>
          <li><Link to="/users/me">My Profile</Link></li>
          <li><Link to="/resumes/register">Create Resume</Link></li>
          <li><Link to="/resumes/list">View Resumes</Link></li>
          <li><Link to="/resumes/1">Edit Resume</Link></li>
          <li><Link to="/sale-resumes">Browse Sales Posts</Link></li>
          <li><Link to="/sales-resumes/1/register">Register Sales Resume</Link></li>
          <li><Link to="/sale-resumes/1">View Sales Post</Link></li>
          <li><Link to="/sale-resumes/user">My Sales Posts</Link></li>
          <li><Link to="/sale-resumes/user/1">View My Sales Post</Link></li>
          <li><Link to="/resumes/admin">Admin: Resume List</Link></li>
          <li><Link to="/resumes/admin/1">Admin: View Resume</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;