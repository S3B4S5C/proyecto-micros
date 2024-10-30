import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { salt, hashedPassword };
};

export const comparePassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};

/**
 * Generates a JWT token with the given id, role and id_linea
 * @param {integer} id - The id of the user
 * @param {string} role - The role of the user
 * @param {integer} id_linea - The id of the line that the user belongs to
 * @return {string} The JWT token
 */
export const generateToken = async (id, role, id_linea) => {
  const token = await jwt.sign(
    {
      id: id,
      role: role,
      id_linea
    },
    TOKEN_KEY,
    {
      expiresIn: "1d",
    },
  );
  return token;
};

/**
 * Given a JWT token, it returns the id of the user that corresponds to it
 * @param {string} token - The JWT token
 * @return {integer|undefined} The id of the user if the token is valid, undefined if the token is invalid
 */
export const userFromToken = (token) => {
  let user;
    jwt.verify(token, TOKEN_KEY, (err, id, role) => {
      if (err) return console.error("token invalido");
      user = id.id
    });
    return user
};

/**
 * Given a JWT token, it returns the id_linea of the user that corresponds to it
 * @param {string} token - The JWT token
 * @return {integer|undefined} The id_linea of the user if the token is valid, undefined if the token is invalid
 */
export const idLineaFromToken = (token) => {
  let idLinea;
    jwt.verify(token, TOKEN_KEY, (err, id, role) => {
      if (err) return console.error("token invalido");
      idLinea = id.id_linea
    });
    return idLinea
};