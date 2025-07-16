const User = require('../models/User');
const CampaignRequestModel  = require('../models/CampaignRequest');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config

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


exports.deleteAddress = async (req, res) => {
  const { userId, addressId } = req.body;
  
  try {
    // Use the $pull operator to remove the address subdocument that matches addressId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: 'Error deleting address' });
  }
};

exports.editPhone = async (req, res) => {
  const { phone, _id } = req.body;
  if (!phone || !_id) {
    return res.status(400).json({ message: 'Phone number and user ID are required.' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(

      {_id:_id}, // User ID to find the user
      {phone}, // Only update the 'phone' field
      { new: true } // Return the updated user object
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating phone number:", error);
    res.status(500).json({ message: 'Error updating phone number.' });
  }
};


exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file was uploaded.' });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // If the user has an existing picture with a public_id, delete it from Cloudinary
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }

    // Upload the new image to Cloudinary from the buffer provided by multer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures", resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update the user's document with the new image URL and public_id
    user.profilePicture = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    await user.save();

    res.json({
      msg: 'Profile picture updated successfully!',
      profilePicture: user.profilePicture,
    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ msg: 'Server Error: Could not update profile picture.' });
  }
};