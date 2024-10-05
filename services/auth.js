import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '../config.js';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return { salt, hashedPassword }
};

export const comparePassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword)
  return result
};

export const generateToken = async (id) => {
  const token = await jwt.sign( 
    {
      id: id
    },
    TOKEN_KEY, 
    {
      expiresIn: '1d'
    })
  return token
}