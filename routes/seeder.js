var express = require('express');
var router = express.Router();
var Menu = require('../models/menu');

/* GET home page. */
router.get('/:total', async function(req, res, next) {
  let type = ["food", "drink"];
  let category = {
    "food": ["pizza", "pasta", "noodle", "burger"],
    "drink": ["juice", "coffee", "tea", "mineral"]
  };

  var collection = [];
  for (let index = 0; index < req.params.total; index++) {
    let pickType = randomPick(type, type.length);
    let pickCategory = randomPick(category[pickType], category[pickType].length);
    let obj = {
      name: "menu " + Math.floor(Math.random() * 1000),
      price: (Math.floor(Math.random() * 1000)) * 100,
      category: pickCategory,
      type: pickType
    };
    collection.push(obj);
  }

  Menu.insertMany(collection)
    .then(() => res.send("seeder"))
    .catch((error) => {
      console.log(error);
      res.send("error");
    });
});

function randomPick(arr, length) {
  return arr[Math.floor(Math.random() * length)];
}

module.exports = router;
