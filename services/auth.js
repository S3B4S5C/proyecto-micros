import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return { salt, hashedPassword }
};


export const comparePassword = async (password, hashedPassword, salt) => {
  const hash = await bcrypt.hash(password, salt)
  return hash === hashedPassword
};