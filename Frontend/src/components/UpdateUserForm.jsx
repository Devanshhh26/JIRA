import React, { useState } from "react";
import { TextField, Button, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../slices/userSlice";
import NavBar from "./Navbar";

const UpdateUserForm = () => {

  const {user}=useSelector((state)=>state.user)
  const dispatch=useDispatch();

  const [formData, setFormData] = useState({
    name: `${user.name}`,
    email: `${user.email}`,
    role: `${user.role}`,
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const roles = ["Viewer", "Developer", "Project Manager"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put("http://localhost:3000/api/v1/auth/updateUser", formData, {
        withCredentials: true,
      });
      setSuccess(response.data.message || "User updated successfully!");
      dispatch(updateUser(response.data.user))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavBar/>
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Box
        className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full"
        sx={{ width: { xs: "100%", sm: "80%", md: "60%" } }}
      >
        <Typography variant="h5" className="text-center font-bold mb-6">
          Update Your Information
        </Typography>

        {error && <Typography color="error" className="mb-4">{error}</Typography>}
        {success && <Typography color="success" className="mb-4">{success}</Typography>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} color="secondary" /> : "Update Info"}
          </Button>
        </form>
      </Box>
    </Box>
    </>
  );
};

export default UpdateUserForm;
