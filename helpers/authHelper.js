import bcrypt from "bcrypt";

// To hash the Password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPasword = await bcrypt.hash(password, saltRounds);
    return hashedPasword;
  } catch (error) {
    console.log(error);
  }
};

// To compare Password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
