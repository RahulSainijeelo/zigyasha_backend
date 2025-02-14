import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { School } from "../models/school.model.js";
import { Student } from "../models/student.model.js";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { email, password, role, schoolId } = req.body;

    if (!email || !password || !role || !schoolId) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }

    switch (role.toLowerCase()) {
      case "student": {
        const user = await School.findOne({ schoolId });
        if (user)
          return res.status(400).json({
            message: "School not exist.",
            success: false,
          });
      }
      case "teacher": {
        const user = await School.findOne({ schoolId });
        if (!user)
          return res.status(400).json({
            message: "School not exist.",
            success: false,
          });
      }
      case "school": {
        const user = await School.findOne({ schoolId });
        if (user)
          return res.status(400).json({
            message: "School already exist with this SchoolId.",
            success: false,
          });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { _id } = await User.create({
      email,
      password: hashedPassword,
      role,
      schoolId,
    });
    if (_id) {
      let result;
      switch (role.toLowerCase()) {
        case "student": {
          const { fullName, age, gender, schoolId, level, grade } = req.body;
          result = await Student.create({
            fullName,
            age,
            gender,
            schoolId,
            level,
            grade,
            userId: _id,
          });
        }
        case "teacher": {
          const { fullName, gender, schoolId, subject, qualification, grade } =
            req.body;

          result = await Student.create({
            fullName,
            gender,
            schoolId,
            subject,
            grade,
            qualification,
            userId: _id,
          });
        }
        case "school": {
          const { name, address, phone, level, schoolId, principal } = req.body;

          result = await School.create({
            name,
            address,
            level,
            phone,
            principal,
            schoolId,
            userId: _id,
          });
        }
      }
    }
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,

      role: user.role,
    };
    return res.status(200).send({ token: token,user });

    // return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
    //     message: `Welcome back ${user.fullName}`,
    //     user,
    //     success: true
    // })
  } catch (error) {
    console.log(error);
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    // updating data
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    await user.save();

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,

      role: user.role,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
