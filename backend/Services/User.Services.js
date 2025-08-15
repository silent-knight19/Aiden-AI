import userModel from "../Models/User.model.js";

export const CreateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const hashPassword = await userModel.hashPassword(password);
  const user = await userModel.create({ email, password: hashPassword });
};
export default CreateUser;