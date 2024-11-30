const express = require('express');
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const userRoutes=require("./routes/User");
const projectRoutes=require("./routes/Project");
const taskRoutes=require("./routes/Task");
const teamRoutes=require("./routes/Team");
const commentRoutes=require("./routes/Comment");
const notificationRoutes=require("./routes/Notification");
const drawboardRoutes=require("./routes/Drawboard");
const auditlogRoutes=require("./routes/AuditLog");

dotenv.config();
const PORT = process.env.PORT || 4000;
database.connect();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
}));


app.use(cookieParser());
app.use(express.json()); 

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/project",projectRoutes);
app.use("/api/v1/task",taskRoutes);
app.use("/api/v1/team",teamRoutes);
app.use("/api/v1/comment",commentRoutes);
app.use("/api/v1/notification",notificationRoutes);
app.use("/api/v1/drawboard",drawboardRoutes);
app.use("/api/v1/auditlog",auditlogRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
