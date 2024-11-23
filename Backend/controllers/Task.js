const Task=require("../models/Task");
const Project=require("../models/Project");
const Comment = require('../models/Comment');

const createTask=async(req,res)=>{
    try{
        const {title,description,project,assignedTo,status,priority,dueDate,tags,attachments}=req.body;
        if(!title   ||  !project){
            return res.status(400).json({message:"Title and Project are compulsory"});
        }
        const projectExists=await Project.findById(project);
        if(!project){
            return res.status(404).json({message:"No project found"});
        }
        const newTask=new Task({
            title,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate,
            attachments,
            tags: Array.isArray(tags) ? tags : []
        })
        const savedTask=await newTask.save();
        projectExists.tasks.push(savedTask._id);
        await projectExists.save();
        return res.status(201).json({
            success:true,
            message:"task Created Successfully",
            task:newTask,
        });
    }catch(error){
        console.error("Error creating task : ",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};


const editTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;
        const updates = req.body;

        const task = await Task.findById(taskId).populate('project').exec();
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isCreator = task.project.owner.toString() === userId.toString();

        const isAssigned = task.assignedTo && task.assignedTo.toString() === userId.toString();

        if (isCreator) {

            Object.assign(task, updates);
        } else if (isAssigned) {
            if (Object.keys(updates).length > 1 || !updates.status) {
                return res.status(403).json({
                    message: 'You can only update the status of the task.',
                });
            }
            task.status = updates.status;
        } else {
            return res.status(403).json({
                message: 'You do not have permission to edit this task.',
            });
        }

        const updatedTask = await task.save();

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findById(taskId).populate('project').exec();
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isCreator = task.project.owner.toString() === userId.toString();

        if (isCreator) {
            
            await Project.findByIdAndUpdate(
                task.project._id,
                { $pull: { tasks: taskId } },
                { new: true }
            );
            await task.remove();
            return res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
            });
        } else {
            return res.status(403).json({
                message: 'You do not have permission to delete this task.',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getTaskById = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id)
        .populate('assignedTo')
        .populate('project');
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ task });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error });
    }
  };

  const getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find()
        .populate('assignedTo')
        .populate('project');
      
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  };

  const assignTask = async (req, res) => {
    const { userId } = req.body;  
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      const isCreator = task.createdBy.toString() === req.user._id.toString();
      if (!isCreator) {
        return res.status(403).json({ message: 'You are not authorized to assign this task' });
      }
  
      task.assignedTo = userId;
      await task.save();
  
      res.status(200).json({ message: 'Task assigned successfully', task });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning task', error });
    }
  };


const getAllTasksForProject = async (req, res) => {         // fetches all tasks in a project but only owner can access it
    const projectId = req.params.projectId;
    const userId = req.user._id;

    try {

        const project = await Project.findById(projectId).populate('owner');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view tasks of this project' });
        }

        const tasks = await Task.find({ project: projectId });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this project' });
        }

        return res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching tasks for this project', error });
    }
};


const getAllTasksAssignedToUser = async (req, res) => {
    const userId = req.user._id; // Assuming authentication middleware has set `req.user`

    try {
        // Fetch all tasks assigned to the current user
        const tasks = await Task.find({ assignedTo: userId });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks assigned to you' });
        }

        return res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching tasks assigned to you', error });
    }
};

const addCommentToTask = async (req, res) => {
    const { taskId } = req.params; 
    const { message, parent } = req.body; 
    const userId = req.user._id; 

    try {
        const task = await Task.findById(taskId).populate('project assignedTo');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isOwner = task.project.owner.toString() === userId.toString();
        const isAssigned = task.assignedTo.toString() === userId.toString();

 
        if (!isOwner && !isAssigned) {
            return res.status(403).json({ message: 'You are not authorized to comment on this task' });
        }

        const newComment = new Comment({
            task: taskId,
            user: userId,
            message,
            parent: parent || null,
        });


        await newComment.save();

        task.comments.push(newComment._id);
        await task.save();

        return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding comment', error });
    }
};


  // file upload baad me 

module.exports={createTask, editTask, deleteTask,getTaskById,getAllTasks,assignTask ,getAllTasksForProject , getAllTasksAssignedToUser, addCommentToTask};