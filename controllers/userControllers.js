import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config(); 

// 📌 Register User (Sign Up)
export function postUsers(req, res) {
  const { email, password, firstName, lastName, type, whatsApp, phone } = req.body;

  // Hash password before storing
  bcrypt.hash(password, 10, (err, passwordHash) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password", error: err.message });
    }

    const newUser = new User({
      email,
      password: passwordHash, // Store hashed password
      firstName,
      lastName,
      type,
      whatsApp,
      phone
    });

    newUser.save()
      .then(() => {
        res.json({ message: "User created successfully" });
      })
      .catch(err => {
        res.status(500).json({ message: "User not created", error: err.message });
      });
  });
}

// 📌 Login User (Sign In)
export function loginUser(req, res) {
  const { email, password } = req.body;

  // Find user by email only
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare entered password with stored hashed password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type
      };

      const token = jwt.sign(payload,process.env.JWT_KEY, { expiresIn: "48h" });

      res.json({
        message: "User logged in successfully",
        user: user,
        token: token
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Login failed", error: err.message });
    });
}
export function isAdminValid(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.type != "admin") {
        return false;
    }
    return true;  
}