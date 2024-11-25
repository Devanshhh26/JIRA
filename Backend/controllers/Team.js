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

const addMemberToTeam=async(req,res)=>{
    try{
        const {teamId}=req.params;
        const {memberId}=req.body;
        const userId=req.user._id;
        console.log(memberId);
        const team=await Team.findById(teamId);

        if(!team){
            return res.status(404).json({ success:false,message: 'Team not found.' });
        }
        if(team.createdBy.toString()!==userId.toString()){
            return res.status(403).json({ success:false,message: 'Not Authorized to add memebers' });
        }
        if(team.members.includes(memberId)){
            return res.status(400).json({success:false, message: "Member already in the team"});
        }
        const member=await User.findById(memberId);
        if(!member){
            return res.status(404).json({ success:false,message: 'User not found.' });
        }
        team.members.push(memberId);
        await team.save();

        return res.status(200).json({
            success: true,
            message: "Member added to Team successfully",
            team
        })

    }catch(error){
        console.error('Error adding member:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}


const removeMemberFromTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { memberId } = req.body; 
        const userId = req.user._id;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        if (team.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to remove members from this team.' });
        }

        if (!team.members.includes(memberId)) {
            return res.status(400).json({ message: 'Member is not in the team.' });
        }

        team.members = team.members.filter((id) => id.toString() !== memberId.toString());
        await team.save();

        return res.status(200).json({
            success: true,
            message: 'Member removed successfully.',
            team,
        });
    } catch (error) {
        console.error('Error removing member:', error);
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

        // Update all projects associated with the team to remove the team reference
        await Project.updateMany(
            { _id: { $in: team.projects } }, // Find projects associated with the team
            { $set: { team: null } }         // Set their team field to null
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

module.exports={createTeam,addMemberToTeam,removeMemberFromTeam,deleteTeam};
