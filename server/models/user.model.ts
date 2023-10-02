import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Regular expression pattern for validating email addresses
const emailRegexPattern: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

// User interface
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<[courseId: string]>;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

/**
 * User schema for MongoDB
 * @param {string} name - User's name
 * @param {string} email - User's email
 */
const userSchema: Schema<User> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [30, "Your name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

//Hashing the password using bcrypt
userSchema.pre<User>("save", async function (next) {
  if (this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Comparing the ps
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<User> = mongoose.model("User", userSchema);

export default UserModel;
