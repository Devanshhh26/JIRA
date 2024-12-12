import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NavBar from './Navbar';

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/available-users', {
          withCredentials: true,
        });
        setAvailableUsers(response.data.users);
        setLoadingUsers(false);
      } catch (error) {
        console.error('Error fetching available users:', error);
        setMessage('Failed to load available users.');
        setLoadingUsers(false);
      }
    };

    fetchAvailableUsers();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName) {
      setMessage('Team name is required.');
      return;
    }

    if (members.length === 0) {
      setMessage('Please select at least one member.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/team/create',
        { name: teamName, members },
        { withCredentials: true }
      );

      setMessage(response.data.message || 'Team created successfully.');
      setTeamName('');
      setMembers([]);
    } catch (error) {
      console.error('Error creating team:', error);
      setMessage(error.response?.data?.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavBar/>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 4,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create Team
      </Typography>

      <TextField
        label="Team Name"
        variant="outlined"
        fullWidth
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        margin="normal"
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="members-label">Select Members</InputLabel>
        <Select
          labelId="members-label"
          multiple 
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          renderValue={(selected) =>
            availableUsers
              .filter((user) => selected.includes(user._id))
              .map((user) => user.name)
              .join(', ')
          }
        >
          {loadingUsers ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            availableUsers.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} ({user.email})
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {message && (
        message=="Team created successfully."? 
        <Typography variant="body2" color ="success" mt={2} gutterBottom>
          {message}
        </Typography>:
        <Typography variant="body2" color="error" mt={2} gutterBottom>
          {message}
        </Typography>
      )}

      <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Team'}
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default CreateTeamForm;
