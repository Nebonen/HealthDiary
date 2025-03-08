import * as userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Register a new user
 */
const registerUser = async (req, res, next) => {
  try {
    const {username, email, password} = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({message: 'Please provide username, email and password'});
    }

    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({message: 'User with this email already exists'});
    }

    // Create user
    const newUser = await userModel.createUser({username, email, password});

    // Return success response (without password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({message: 'Please provide email and password'});
    }

    // Find user by email
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        userLevel: user.user_level,
      },
      process.env.JWT_SECRET,
      {expiresIn: '24h'},
    );

    // Return token
    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience,
        userLevel: user.user_level,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getUserProfile = async (req, res, next) => {
  try {
    // User ID should be available from authentication middleware
    const userId = req.user.userId;

    // Get user data
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Return user data
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Validate the token
 */
const validateToken = async (req, res, next) => {
  try {
    // If the request gets to this point, the token is valid
    // (The authentication middleware already verified it)

    res.json({
      valid: true,
      user: {
        userId: req.user.userId,
        email: req.user.email,
        userLevel: req.user.userLevel,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {registerUser, loginUser, getUserProfile, validateToken};
