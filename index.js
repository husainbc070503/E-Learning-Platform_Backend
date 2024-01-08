require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const connectToMongoDB = require('./connection/mongo');
const ErrorHandler = require('./middlewares/ErrorHandler');

connectToMongoDB();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api/user', require('./routes/User'));
app.use('/api/category', require('./routes/Category'));
app.use('/api/course', require('./routes/Course'));
app.use('/api/lesson', require('./routes/Lesson'));
app.use('/api/enroll', require('./routes/Enrollment'));
app.use('/api/comment', require('./routes/Comment'));

app.use(ErrorHandler);
app.listen(port, () => console.log(`Server running on port ${port}`));