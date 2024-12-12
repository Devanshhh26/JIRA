import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import axios from 'axios';
import { logout } from '../slices/userSlice';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/profile':
        return 'Profile';
      case '/dashboard/team':
        return 'Create a Team';
      case '/dashboard/team':
        return 'Create a Team';
      case '/dashboard/team/updateteam':
        return 'Edit Team';
      case '/dashboard/project':
        return 'Projects';
      case '/dashboard/task':
          return 'Tasks';
      default:
        return 'Dashboard';
    }
  };

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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getTitle()}
          </Typography>

          {isAuthenticated && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                  }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dashboard/profile')}>
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dashboard/team')}>
              <ListItemIcon><GroupAddIcon  /></ListItemIcon>
              <ListItemText primary="Create Team" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dashboard/team/updateteam')}>
              <ListItemIcon><GroupsIcon /></ListItemIcon>
              <ListItemText primary="Update Team" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dashboard/project')}>
              <ListItemIcon><BusinessCenterIcon /></ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItem>
            <ListItem button onClick={() => navigate('/dashboard/task')}>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavBar;
