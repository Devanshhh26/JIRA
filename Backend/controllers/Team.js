const Team = require('../models/Team');
const User = require('../models/User');
const Project=require('../models/Project');

const createTeam = async (req, res) => {
    try {
        const { name, members } = req.body;
        const createdBy = req.user._id;

        if (!name) {
            return res.status(400).json({ message: 'Team name is required.' });
        }

        if (members && members.length > 0) {
            const validMembers = await User.find({ _id: { $in: members } });
            if (validMembers.length !== members.length) {
                return res.status(404).json({ message: 'Some members were not found.' });
            }
        }

        const newTeam = new Team({
            name,
            members: members || [],
            createdBy,
        });

        await newTeam.save();

        return res.status(201).json({
            success: true,
            message: 'Team created successfully.',
            team: newTeam,
        });
    } catch (error) {
        console.error('Error creating team:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user._id;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found.' });
        }

        if (team.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this team.' });
        }

        
        await Project.updateMany(
            { _id: { $in: team.projects } },
            { $set: { team: null } }        
        );

        await Team.findByIdAndDelete(teamId);

        return res.status(200).json({
            success: true,
            message: 'Team deleted successfully. Projects have been updated to have no team assigned.',
        });
    } catch (error) {
        console.error('Error deleting team:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

const getUserTeams = async (req, res) => {
    try {
      const userId = req.user._id; 

      const teams = await Team.find({ createdBy: userId })
        .populate('members', 'name email') 
        .populate('projects', 'title description')
        .exec();
  
      if (!teams.length) {
        return res.status(404).json({
          success: false,
          message: 'No teams found created by this user.',
        });
      }
  
      res.status(200).json({
        success: true,
        teams,
      });
    } catch (error) {
      console.error('Error fetching user teams:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

  const updateTeam = async (req, res) => {
    try {
      const { teamId } = req.params;
      const { name, members } = req.body;
  
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found.' });
      }
  
      if (team.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to edit this team.' });
      }
  
      if (name) team.name = name;
      if (members) team.members = members;
  
      const updatedTeam = await team.save();
  
      res.status(200).json({
        success: true,
        message: 'Team updated successfully.',
        updatedTeam,
      });
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
  
  


module.exports={createTeam,deleteTeam,getUserTeams,updateTeam};
