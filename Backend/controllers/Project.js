const Project = require('../models/Project');
const Team = require('../models/Team');

const createProject = async (req, res) => {
    try {
        const { name, description, teamId } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Project name is required.' });
        }

        let team = null;
        if (teamId) {
            team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found.' });
            }
        }
        
        const newProject = new Project({
            name,
            description,
            owner: req.user._id, 
            team: teamId || null,
        });
 
        await newProject.save();

        return res.status(201).json({
            success: true,
            message: 'Project created successfully.',
            project: newProject,
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const editProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description, teamId, archived } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to edit this project.' });
        }

        if (name) project.name = name;
        if (description) project.description = description;

        if (teamId) {
            const team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found.' });
            }
            project.team = teamId;
        }

        if (typeof archived === 'boolean') {
            project.archived = archived;
        }

        // Save the updated project
        const updatedProject = await project.save();

        return res.status(200).json({
            success: true,
            message: 'Project updated successfully.',
            project: updatedProject,
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this project.' });
        }

        if (project.tasks && project.tasks.length > 0) {
            await Task.deleteMany({ _id: { $in: project.tasks } });
        }

        await project.remove();

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate('owner', 'name email')
            .populate('team', 'name members')
            .populate('tasks'); 
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({ 
            $or: [ 
                { owner: userId }, 
                { team: { $in: req.user.team } }
            ] 
        });

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getProjectsAssignedToUser=async(req,res)=>{
    try{
        const {userId}=userId;
        const Project=await Project.find({assigned})
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const archiveProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        project.archived = true;
        await project.save();

        return res.status(200).json({
            success: true,
            message: 'Project archived successfully.',
        });
    } catch (error) {
        console.error('Error archiving project:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateTeamMembers = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { membersToAdd, membersToRemove } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        if (membersToAdd) {
            project.team = [...new Set([...project.team, ...membersToAdd])];
        }

        if (membersToRemove) {
            project.team = project.team.filter(
                member => !membersToRemove.includes(member.toString())
            );
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: 'Team updated successfully.',
            team: project.team,
        });
    } catch (error) {
        console.error('Error updating team:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const searchProjects = async (req, res) => {
    try {
        const { query } = req.query; // Example: ?query=projectName

        const projects = await Project.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
                { description: { $regex: query, $options: 'i' } },
            ],
        });

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error('Error searching projects:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = { createProject, editProject, deleteProject,getProject,getAllProjects,archiveProject,updateTeamMembers,searchProjects};

