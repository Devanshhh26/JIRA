import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const Signup = () => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Viewer',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/signup', data);
      console.log('API Response:', response.data);

      setSuccess(true);
      reset();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '2rem',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" component="h1" align="center" mb={3}>
          Signup
        </Typography>

        {success && (
          <Typography variant="body1" color="green" align="center" mb={2}>
            Signup successful! 🎉
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="red" align="center" mb={2}>
            {error}
          </Typography>
        )}

        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Enter a valid email address',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select {...field} labelId="role-label" label="Role">
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Project Manager">Project Manager</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: '1rem', padding: '0.75rem' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Signup'}
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
