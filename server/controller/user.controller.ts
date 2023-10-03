import { Request, Response, NextFunction } from "express";
import UserModel, { User } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsync } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();

//Registering the user
interface RegistrationLayout {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

//Creating the activation token
interface ActivationToken {
  token: string;
  activationCode: string;
}

export const registerUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await UserModel.findOne(email);
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: RegistrationLayout = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createActivationToken = (user: any): ActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign({ activationCode }, process.env.JWT_SECRET as Secret, {
    expiresIn: "10m",
  });
  return { token, activationCode };
};
