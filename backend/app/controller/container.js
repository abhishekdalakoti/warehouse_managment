const Container = require("../models/container.js");

exports.createcontainer = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const container = new Container({
    hold_type: req.body.hold_type,
    hold_id: req.body.hold_id,
    parent: req.body.parent,
    label:req.body.label
  });
  Container.create(container, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the container."
      });
    }
    else res.status(200).send(data);
  });

};
exports.getContainerbyId = (req, res) => {
  id = req.params.id;
  Container.getContainerbyID(id, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(404).send({
          message: `Not found Container with id ${id}.`
        });
      }
      else {
        res.status(500).send({
          message: "Error retrieving Container with id " + req.params.id
        });
      }
    }
    else {
      res.status(200).send(data);
    }
  });

};
exports.deleteContainer = (req, res) => {

  var id = req.params.id;
  Container.deleteContainer(id, (err, data) => {
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
exports.getContainers = (req, res) => {
  Container.getContainers((err, data) => {
   // console.log(err,data);
    if (err) {
      res.status(500).send({
        message: "Error fetching containers"

      })
    }
    else {
     // console.log("OK");
      res.status(200).send(data);
    }

  });
}
exports.getDeletableContainers = (req, res) => {
  var id=req.params.id;
  Container.isdeletable(id,(err, data) => {
   // console.log(err,data);
    if (err) {
      res.status(500).send({
        message: "Error fetching deletable containers",
      });
    }
    else {

      res.status(200).send(data);
    }

  });
}
exports.movecontainer=(req,res)=>{
  var to =req.body.to;
  var from = req.body.from;
  var to_move=req.body.to_move;
  if((typeof(from)=='undefined')||(from==null)||(from=='')){
    Container.moveparentContainers(to_move,to,(err,data)=>{
      // console.log(err,data);
       if(err){
         if(err.message){
           res.status(404).send({"message":err.message});
         }
         else {
           res.status(500).send({
             message: "Error deleting Container with id " + req.params.id
           });
         }
       }
       else{
         console.log(data);
         res.status(200).send({"data":"SUCESSFULLY REMOVED"});
       }
     });
  }
  else{
  Container.moveContainers(to_move,from,to,(err,data)=>{
   // console.log(err,data);
    if(err){
      if(err.message){
        res.status(404).send({"message":err.message});
      }
      else {

        res.status(500).send({
          message: "Error deleting Container with id " + req.params.id
        });
      }
    }
    else{
      console.log(data);
      res.status(200).send(data);
    }
  });
}
}
exports.getallelementsunder=(req,res)=>{
var id=parseInt(req.params.id);
Container.getAllItemsUnder([id],[],(err,data)=>{
  if(err){
    res.status(500).send(err);
  }
  else{
    res.status(200).send(data);
  }
})
}
exports.getContainerbytype=(req,res)=>{
  type=req.params.type;
  Container.getContainersbyType(type,(err,data)=>{
    if(err){
      if(err.message){
        res.status(400).send(err.message);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.status(200).send(data);
    }
  })

};
exports.possiblemovablecontainers=(req,res)=>{
  var id=req.params.id;
  Container.possiblemovalecontainers(id,(err,data)=>{
    if (err) {
      res.status(500).send({
        message: "Error fetching containers"

      })
    }
    else{
      res.status(200).send(data);
    }
  })
};