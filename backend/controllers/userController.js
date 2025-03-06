const User = require('../models/User');
const CampaignRequestModel  = require('../models/CampaignRequest');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateName = async (req, res) =>{
  const { name, _id } = req.body;
  // res.json(req.body);
  try {
    // console.log(name,_id);
    const updatedUser = await User.findByIdAndUpdate(
      {_id:_id}, // User ID to find the user
      {name}, // Only update the 'name' field
      { new: true } // Return the updated user object
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send('Error updating profile');
    // res.json(error);
  }
};
exports.updateAddress = async (req, res) => {
  const { addresses, _id } = req.body; // Expecting addresses to be an array of address objects
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,                // User ID
      { addresses },      // Update the addresses field
      { new: true }       // Return the updated user document
    );
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating addresses:', error);
    res.status(500).send('Error updating addresses');
  }
};


exports.campaignRequestSave = async (req, res) => {
  const { userId,email } = req.body; // Fix destructuring

  try {
    // Create a new instance of the CampaignRequest model
    const existingRequest = await CampaignRequestModel.findOne({ userId:userId });
    // console.log(existingRequest);
    if(existingRequest){  
      // console.log("found");
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!userId || !email) {
      return res.status(200);
    }
    const campaignRequest = new CampaignRequestModel({
      userId: userId, 
      email:email
    });

    // Save the instance to the database
    const savedRequest = await campaignRequest.save();

    // Return a success response
    res.status(200).json({ message: 'Request saved successfully', data: savedRequest });
  } catch (error) {
    // Return an error response
    res.status(500).json({ message: 'Failed to save request', error });
  }
};
