import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import exerciseRoute from "./routes/exercise.route.js";
import exerquestionRoute from "./routes/exerciseQuestion.route.js";
import questionRoute from "./routes/question.route.js";
import quizRoute from "./routes/quiz.route.js";
import schoolRoute from "./routes/school.route.js";
import exercisereportRoute from "./routes/studentExerciseReport.route.js";
import reportRoute from './routes/studentReport.route.js';
import userRoute from "./routes/user.route.js";
import connectDB from './utils/db.js';
dotenv.config({});
const app=express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// const corsOptions={
//     origin: 'http://localhost:5173',
//     credentials:true
// }

// app.use(cors(corsOptions));

const PORT=process.env.PORT || 3000;

// api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/school",schoolRoute);
app.use("/api/v1/quiz",quizRoute);
app.use("/api/v1/question",questionRoute);
app.use("/api/v1/report",reportRoute);
app.use("/api/v1/exercise",exerciseRoute);
app.use("/api/v1/exerquestion",exerquestionRoute);
app.use("/api/v1/exercisereport",exercisereportRoute);



app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})