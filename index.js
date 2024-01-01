const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require('./Routes/auth.route');
const jobPostRoute = require('./Routes/jobPost.route');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "SUCESS",
        message: "All Good"
    })
})

// Api to register and lohin user
app.use('/', authRoute);

// Api to create a new Job
app.use('/', jobPostRoute)

const port = process.env.PORT || 8000;

app.listen(port, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running at port`))
        .catch((error) => console.log(error))
})