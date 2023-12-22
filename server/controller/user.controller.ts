import { Request, Response, NextFunction } from "express";
import UserModel, { User } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsync } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import ejs from "ejs";
import mailSend from "../utils/mailSender";
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

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user: RegistrationLayout = {
        name,
        email,
        password: hashedPassword,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mail/activation-mail.ejs"),
        data
      );

      try {
        await mailSend({
          email: user.email,
          subject: "Account activation",
          template: "activation-mail.ejs",
          data,
        });

        res.status(200).json({
          success: true,
          message: `Activation code sent to your email: ${user.email}`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
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
