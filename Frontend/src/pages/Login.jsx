import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      console.log('Submitting login data:', data);
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', data, {
        withCredentials: true,
      });

      console.log('Login response:', response);

      if (response.status === 200) {
        dispatch(
          setUser({
            user: response.data.user,
            isAuthenticated: true,
          })
        );
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register('email', { 
                required: 'Email is required', 
                pattern: { 
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
                  message: 'Invalid email address' 
                } 
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>
          <div className="mb-6">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="secondary" /> : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
