const Drawboard = require('../models/Drawboard');
const Project = require('../models/Project');

const createDrawboard = async (req, res) => {
    try {
        const { project, data } = req.body;
        const userId = req.user._id; // Assuming authentication middleware sets req.user

        // Validate project
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        const newDrawboard = new Drawboard({
            project,
            data: data || '',
            lastUpdatedBy: userId,
        });

        await newDrawboard.save();

        return res.status(201).json({
            success: true,
            message: 'Drawboard created successfully.',
            drawboard: newDrawboard,
        });
    } catch (error) {
        console.error('Error creating drawboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const getDrawboard = async (req, res) => {
    try {
        const { projectId } = req.params;

        const drawboard = await Drawboard.findOne({ project: projectId });

        if (!drawboard) {
            return res.status(404).json({ success: false, message: 'Drawboard not found for this project.' });
        }

        return res.status(200).json({
            success: true,
            drawboard,
        });
    } catch (error) {
        console.error('Error fetching drawboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const updateDrawboard = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { data } = req.body;
        const userId = req.user._id; // Assuming authentication middleware sets req.user

        const drawboard = await Drawboard.findOne({ project: projectId });

        if (!drawboard) {
            return res.status(404).json({ success: false, message: 'Drawboard not found for this project.' });
        }

        drawboard.data = data || drawboard.data;
        drawboard.lastUpdatedBy = userId;
        drawboard.updatedAt = Date.now();

        await drawboard.save();

        return res.status(200).json({
            success: true,
            message: 'Drawboard updated successfully.',
            drawboard,
        });
    } catch (error) {
        console.error('Error updating drawboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


const deleteDrawboard = async (req, res) => {
    try {
        const { projectId } = req.params;

        const drawboard = await Drawboard.findOneAndDelete({ project: projectId });

        if (!drawboard) {
            return res.status(404).json({ success: false, message: 'Drawboard not found for this project.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Drawboard deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting drawboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports={createDrawboard,updateDrawboard,getDrawboard,deleteDrawboard};