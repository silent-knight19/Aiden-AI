import User from "../Models/User.model.js";

export const getAllUsers = async ({ userId }) => {
  try {
    // Exclude the logged-in user from the list or return all users
    const users = await User.find({ _id: { $ne: userId } });
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error('Error fetching user by ID');
  }
};

export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Error creating user');
  }
};