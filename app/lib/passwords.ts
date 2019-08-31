import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const comparePasswords = async (plainPass: string, hashword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPass, hashword);
};

// Check if password is strong enough It's an async function because in future
// we might use a service like haveibeenpwned to check password security
export const isStrongPassword = async (password: string): Promise<boolean> => {
  return password.length >= 6;
};
