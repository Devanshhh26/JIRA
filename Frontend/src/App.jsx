import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Error from './pages/Error'
import Dashboard from './pages/Dashboard'
import Projects from './components/Projects'
import Tasks from './components/Tasks'
import UpdateUserForm from './components/UpdateUserForm'
import Team from './components/Team'
import UpdateTeam from './components/UpdateTeam'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/dashboard/profile" element={<UpdateUserForm/>}/>
      <Route path="/dashboard/project" element={<Projects/>}/>
      <Route path="/dashboard/task" element={<Tasks/>}/>
      <Route path="/dashboard/team" element={<Team/>}/>
      <Route path="/dashboard/team/updateteam" element={<UpdateTeam/>}/>
      <Route path="*" element={<Error/>}/>
    </Routes>
    </>
  )
}

export default App
