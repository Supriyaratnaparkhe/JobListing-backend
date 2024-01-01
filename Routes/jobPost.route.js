const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const JobPost = require('../models/jobPost');

// Error handler
const errorhandler = (res, error)=>{
    res.status(error.status || 500).json({error:"Internal Server error"});
};

// Protected route with user authorization middleware
router.post('/addJob', authenticate, async (req, res) => {

    try {
        
        // Validate request body
        const { companyName, remote, skills, logoURL, position, salary, jobType, location, description, about } = req.body;

        if (!companyName || !remote || !skills || !logoURL || !position || !salary || !jobType || !location || !description || !about) {
            return res.status(400).json({ message: 'Title and description are required fields' });
        }
    
        const recruiterName = req.body.name;

        let skillsArray = skills;
        if(typeof skills === 'string'){
            skillsArray = skills.split(',').map(skill=> skill.trim());
        }
        // Create job post
        const newJobPost = new JobPost({ companyName, remote, skills:skillsArray, logoURL, position, salary, jobType, location, description, about });
        await newJobPost.save();

        // Return success message
        res.status(201).json({ message: 'Job post created successfully' , name:recruiterName});
    } catch (error) {
        console.log(error);
        errorhandler(res,error);
    }
});

// Protected route to edit job
router.put('/editJob/:jobId', authenticate, async (req, res) => {
    const { companyName, remote, skills, logoURL, position, salary, jobType, location, description, about } = req.body;
    const { jobId } = req.params;
  
    try {
      const jobPost = await JobPost.findById(jobId);
  
      if (!jobPost) {
        return res.status(404).json({ message: 'Job post not found' });
      }
  
      let skillsArray = skills;
        if(typeof skills === 'string'){
            skillsArray = skills.split(',').map(skill=> skill.trim());
        }
      // Update job post fields
      jobPost.companyName = companyName || jobPost.companyName;
      jobPost.remote = remote || jobPost.remote;
      jobPost.skills = skillsArray || jobPost.skillsArray;
      jobPost.logoURL = logoURL || jobPost.logoURL;
      jobPost.position = position || jobPost.position;
      jobPost.salary = salary || jobPost.salary;
      jobPost.jobType = jobType || jobPost.jobType;
      jobPost.location = location || jobPost.location;
      jobPost.description = description || jobPost.description;
      jobPost.about = about || jobPost.about;
      
      await jobPost.save();
  
      res.json({ message: 'Job post updated successfully', jobPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Route to list all jobs with optional filters based on skills and job title
router.get('/listjobs', async (req, res) => {
  const { skills, position } = req.query;
  const filter = {};

  if (skills) {
    filter.skills = { $in: skills.split(',') };
  }

  if (position) {
    filter.position = { $regex: position, $options: 'i' }; // Case-insensitive search
  }

  try {
    let jobs;

    // Check if any filters are applied
    if (Object.keys(filter).length > 0) {
      // Apply filters if at least one filter is provided
      jobs = await JobPost.find(filter).exec();
    } else {
      // No filters applied, return all jobs
      jobs = await JobPost.find().exec();
    }

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to show full job description
router.get('/viewJob/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobPost = await JobPost.findById(jobId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }
    res.json({ jobPost });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;