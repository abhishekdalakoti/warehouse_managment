const Inventory = require("../models/inventory.js");

exports.createinventory = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const inventory = new Inventory({
    parent: req.body.parent,
    label:req.body.label
  });
  Inventory.create(inventory, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the inventory."
      });
    }
    else res.status(200).send(data);
  });

};
exports.getInventory = (req, res) => {
    Inventory.getInventory((err, data) => {
     // console.log(err,data);
      if (err) {
        res.status(500).send({
          message: "Error fetching Inventory"
  
        })
      }
      else {
        res.status(200).send(data);
      }
  
    });
  }
  exports.deleteInventory = (req, res) => {

    var id = req.params.id;
    Inventory.deleteInventory(id, (err, data) => {
      if (err) {
        if (err.message) {
          res.status(400).send({
            message: err.message
          })
        }
        else {
  
          res.status(500).send({
            message: "Error deleting Container with id " + req.params.id
          });
        }
      }
      else {
        console.log(data.data);
        res.status(200).send({"data":"Success"});
      }
    });
  
  }