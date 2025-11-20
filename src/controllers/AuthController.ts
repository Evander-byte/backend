import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { genearteToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static create = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //Prevent duplicated
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      const error = new Error("The email is already registered");
      res.status(409).json({ message: error.message });
      return;
    }
    try {
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = genearteToken();
      await user.save();
      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });
      res.status(200).json("Account created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "There was an error" });
    }
  };
  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Invalid token");
      res.status(401).json({ message: error.message });
      return;
    }
    user.confirmed = true;
    user.token = null;
    await user.save();
    res.status(201).json("Account confirmed successfully");
  };
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    //Checking user exist
    if (!user) {
      const error = new Error("Invalid user");
      res.status(409).json({ message: error.message });
      return;
    }
    //Checking confirmed account
    if (!user.confirmed) {
      const error = new Error(
        "Account no confirmed. Pleas confirm your account"
      );
      res.status(403).json({ message: error.message });
      return;
    }
    //Checking password
    const checkedPassword = await checkPassword(password, user.password);
    if (!checkedPassword) {
      const error = new Error("Invalid password");
      res.status(401).json({ message: error.message });
      return;
    }
    const token = generateJWT(user.id);
    res.status(200).json({ access_token: token });
  };
  static recoverPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid user");
      res.status(404).json({ message: error.message });
      return;
    }
    user.token = genearteToken();
    await user.save();

    await AuthEmail.sendRecoverPasswordMail({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res.json("Check your email and fallow the instructions");
  };
  static valdiateToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    const tokenExists = await User.findOne({ where: { token } });
    if (!tokenExists) {
      const error = new Error("Invalid token");
      res.status(404).json({ message: error.message });
    }
    res.json("Valid token, create a new password");
  };
  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Invalid token");
      res.status(404).json({ message: error.message });
      return;
    }
    //Hash new password
    user.password = await hashPassword(password);
    user.token = null;
    await user.save();
    res.json("Reset password successfully");
  };
  static getAuthUser = async (req: Request, res: Response) => {
    res.json(req.user);
  };
  static updateCurrentPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const { id } = req.user;
    const user = await User.findByPk(id);
    const checkedPassword = await checkPassword(
      current_password,
      user.password
    );
    if (!checkedPassword) {
      const error = new Error("Invalid password");
      res.status(401).json({ message: error.message });
      return;
    }
    const new_password = await hashPassword(password);
    user.password = new_password;
    await user.save();
    res.json("Changed password successfully");
  };
  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.user;
    const user = await User.findByPk(id);
    const checkedPassword = await checkPassword(password, user.password);
    if (!checkedPassword) {
      const error = new Error("Invalid password");
      res.status(401).json({ message: error.message });
      return;
    }
    res.json("Correct Password");
  };
  static changeUsernameOrEmail = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const { id } = req.user;

    try {
      const user = await User.findByPk(id);
      const emailUnique = await User.findOne({ where: { email } });
      if (emailUnique) {
        res.status(409).json({ message: "The email is already registered" });
        return;
      }
      if (!user) {
        res.status(404).json({ message: "user not found" });
        return;
      }

      //Update the fileds if provided
      if (email) {
        user.email = email;
      }

      if (user) {
        user.name = name;
      }

      await user.save();

      let message = "Update successful: ";
      const updates = [];
      if (email) updates.push("email");
      if (name) updates.push("user name");
      message += updates.join(" and ") + " changed successfully";
      res.json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "There was and error" });
    }
  };
}
