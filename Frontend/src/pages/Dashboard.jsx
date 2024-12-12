import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { updateUser, logout } from '../slices/userSlice';
import NavBar from '../components/Navbar';
import UpdateUserForm from '../components/UpdateUserForm';


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/profile', {
          withCredentials: true,
        });
        dispatch(updateUser(response.data.user));
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/login');
      }
    };

    if (!user) {
      fetchUserData(); 
    }
  }, [dispatch, navigate, user]);

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>;
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/logout', {}, {
        withCredentials: true, 
      });

      if (response.data.success) {
        dispatch(logout());
        navigate('/login');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <NavBar/>
      <div className="dashboard">
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
