import db from './db';
import { comparePasswords, hashPassword, createJWT } from './auth';

export const createNewUser = async (req, res) => {
  const user = await db.user.create({
    username: req.body.username,
    password: await hashPassword(req.body.password),
  });

  const token = createJWT(user);
  res.json({ token });
};

export const signIn = async (req, res) => {
  const user = await db.user.read(req.body.username);

  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: 'Wrong password' });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
