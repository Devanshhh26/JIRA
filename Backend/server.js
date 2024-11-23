const express = require('express');
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const userRoutes=require("./routes/User");
const projectRoutes=require("./routes/Project");
const taskRoutes=require("./routes/Task");

dotenv.config();
const PORT = process.env.PORT || 4000;
database.connect();

app.use(cookieParser());
app.use(express.json()); 

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/project",projectRoutes);
app.use("/api/v1/task",taskRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
