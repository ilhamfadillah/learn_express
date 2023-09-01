var express = require('express');
var Menu = require('../models/menu');
var mongoose = require('mongoose');

exports.getMenu = function (req, res, next) {
  Menu.find(req.query).then((result) => {
    res.json({ "data": result });
  }).catch((err) => {
    res.send("Error Menu");
  });
};

exports.showMenu = async function (req, res, next) {
  await Menu.findOne({ _id: req.params.id }).then((result) => {
    res.json({ "data": result });
  }).catch(() => {
    res.send("Not Found");
  })
};

exports.createMenu = async function (req, res, next) {
  try {
    var newMenu = new Menu(req.body);
    await newMenu.save();
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
  return res.status(200).json({ data: "success" })
};

exports.updateMenu = async function (req, res, next) {
  try {
    await Menu.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
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

  return res.status(200).json({ data: "success" })
};

exports.deleteMenu = async function (req, res, next) {
  try {
    await Menu.findOneAndDelete({ _id: req.params.id });
  } catch (err) {
    const errors = {};

    // looping semua error validasi dan menambahkan ke objek errors
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(404).json({ errors });
  }

  return res.status(200).json({ data: "success" })
};