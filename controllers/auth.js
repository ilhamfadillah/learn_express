const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');

// generate random
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email: email, password: hash });
    await user.save();
    const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      data: {
        email: email,
        token: token,
      }
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = {};

      // looping semua error validasi dan menambahkan ke objek errors
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });

      // mengirimkan respons yang berisi objek errors
      return res.status(422).json({ errors });
    } else if (err.name == "MongoServerError" && err.code == 11000) {
      return res.status(409).json({ error: "Data already exist" });
    } else {
      // error lainnya
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        data: {
          email: email,
          token: token,
        }
      });
    } else {
      res.status(403).send('Email atau password salah');
    }
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
}

exports.verifyToken = async function (req, res, next) {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      data: {
        token: token,
        ...decoded,
        expired_at: new Date(decoded.exp * 1000)
      }
    });
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.json({ data: "Token is expired!" });
    }
  }
}

exports.refreshToken = async function (req, res, next) {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = jwt.sign({ email: decoded.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      data: {
        email: decoded.email,
        token: newToken,
      }
    });
  } catch (err) {
    res.status(403).send('Token tidak valid');
  }
}