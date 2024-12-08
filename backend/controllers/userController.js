const User = require('../models/User');
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
exports.updateAddress = async (req, res) =>{
  const { address, _id } = req.body;
  // res.json(req.body);
  try {
    // console.log(name,_id);
    const updatedUser = await User.findByIdAndUpdate(
      {_id:_id}, // User ID to find the user
      {address}, // Only update the 'name' field
      { new: true } // Return the updated user object
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send('Error updating profile');
    // res.json(error);
  }
};

