import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import NavBar from './Navbar';

const UserTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/team/userteams', {
          withCredentials: true,
        });
        setTeams(response.data.teams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.response?.data?.message || 'Failed to fetch teams.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/available-users');
        setAvailableUsers(response.data.users);
      } catch (err) {
        console.error('Error fetching available users:', err);
      }
    };

    fetchUserTeams();
    fetchAvailableUsers();
  },[]);

  const handleOpenModal = (team) => {
    setSelectedTeam(team);
    setTeamName(team.name);
    setMembers(team.members.map((member) => member._id));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  const handleAddMember = (userId) => {
    if (!members.includes(userId)) {
      setMembers((prevMembers) => [...prevMembers, userId]);
    }
  };

  const handleRemoveMember = (userId) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member !== userId));

  };

  const handleDeleteTeam = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/team/delete/${selectedTeam._id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setTeams((prevTeams) => prevTeams.filter((team) => team._id !== selectedTeam._id));
        handleCloseModal();
        alert('Team deleted successfully!');
      } else {
        alert('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      alert(err.response?.data?.message || 'Failed to delete team.');
    }
  };
  

  const handleUpdateTeam = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/team/update/${selectedTeam._id}`,
        { name: teamName, members },
        { withCredentials: true }
      );
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === selectedTeam._id ? response.data.updatedTeam : team
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error('Error updating team:', err);
      alert('Failed to update team.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
    <NavBar/>
    <Box p={2}>
      {teams.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          You haven't created any teams yet.
        </Typography>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={2}>
          {teams.map((team) => (
            <Card key={team._id}>
              <CardContent>
                <Typography variant="h5">{team.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Created At: {new Date(team.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Members: {team.members.map((member) => member.name).join(', ') || 'No members'}
                </Typography>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Button size="small" color="primary" onClick={() => handleOpenModal(team)}>
                  View Details
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          borderRadius={2}
        >
          <Typography variant="h6" gutterBottom>
            Update Team
          </Typography>

          <TextField
            label="Team Name"
            variant="outlined"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            margin="normal"
          />

          <Typography variant="body1" mt={2}>
            Current Members:
          </Typography>
          <Box mt={1}>
            {selectedTeam &&
              selectedTeam.members.map((member) => (
                <Chip
                  key={member._id}
                  label={member.name}
                  onDelete={() => handleRemoveMember(member._id)}
                  color="primary"
                  sx={{ margin: 0.5 }}
                />
              ))}
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="members-label">Select Members to Add</InputLabel>
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
              {availableUsers
                .filter((user) => !members.includes(user._id))
                .map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
            <Button onClick={handleCloseModal} color="secondary" style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTeam} variant="contained" color="primary">
              Update Team
            </Button>
            <Button onClick={handleDeleteTeam} variant="contained" color="primary">
              Delete Team
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
    </>
  );
};

export default UserTeamsPage;
