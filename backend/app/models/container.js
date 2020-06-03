const sql = require("./db.js");
const Container = function (container) {
  this.hold_type = container.hold_type;
  this.hold_id = typeof (container.hold_id) == 'undefined' ? null : container.hold_id;
  this.parent = typeof (container.parent) == 'undefined' ? null : container.parent;
  this.label=typeof(container.label)=='undefined'?null:container.label;
};
Container.getContainersbyType=(type,result)=>{
  if((type!=1)&&(type!=2)){
    result({"message":"Wrong type"},null);
  }
  else{
    sql.query(`Select id,label from container where hold_type= ${type}`,(err,data)=>{
      if(err){
        result(err,null);
      }
      else{
        result(null,data);
      }
    })
  }
}
Container.getContainers = (result) => {
  sql.query("select container.*,wc.barcode_indentifier FROM container join warehouse_contents as wc on container.hold_type=wc.id", (err, data) => {

    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    else {
      result(null, data);
      return;
    }
  });

};
Container.create = (newcontainer, result) => {

  var hold_id = newcontainer.hold_id;
  if (hold_id) {
    result({ "message": "adding content not allowed while creating container" }, null);
    return;
  }
  var parent = newcontainer.parent;
  if((parent!=null)&&(parent!='')){

  module.exports.getContainerbyID(parent, (err, data) => {

    if (err) {
      if (err.kind == "not_found") {
        result({ "message": "This parent Container Dosent Exists" }, null);
        return;
      }
      result(err, null);
      return;
    }
    else {
      if(data.hold_type==2){
        result({ "message": "THIS Container only holds inventory" }, null);
        return;
      }
      sql.query("INSERT INTO container SET ?", newcontainer, (error, res) => {
        if (error) {
          console.log("error: ", error);
          result(error, null);
          return;
        }
        //  console.log(data[0]);
        var hold = data.hold_id;
        if ((hold == null) || (hold == '')) {
          hold = res.insertId;
        }
        else {
          hold += "," + res.insertId;
        }
        //console.log(hold)
        const cont = new Container({
          hold_type: data.hold_type,
          hold_id: hold,
          parent: data.parent,
        });
        module.exports.updateById(data.id, cont, (errors, data_update) => {
          if (errors) {
            result(errors, null);
            return;
          }
          else {
            console.log("created container: ", { id: res.insertId, ...newcontainer });
            result(null, { id: res.insertId, ...newcontainer });
          }
        });

      });
    }
  });
}
else{
  sql.query("INSERT INTO container SET ?", newcontainer, (error, res) => {
    if (error) {
      console.log("error: ", error);
      result(error, null);
      return;
    }

        console.log("created container: ", { id: res.insertId, ...newcontainer });
        result(null, { id: res.insertId, ...newcontainer });
     
    });

}
};
Container.updateById = (id, container, result) => {
  sql.query(
    "UPDATE container SET hold_id = ?, parent = ? WHERE id = ?",
    [container.hold_id, container.parent, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated container: ", { id: id, ...container });
      result(null, { id: id, ...container });
    }
  );
};
Container.getContainerbyID = (id, result) => {
  sql.query(`SELECT container.*,wc.barcode_indentifier FROM container join warehouse_contents as wc on container.hold_type=wc.id WHERE container.id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found container: ", res[0]);

      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
}
Container.deleteContainer = (id, result) => {
  module.exports.getContainerbyID(id,(err,data_id)=>{
    if(err){
      result(err,null);
    }
    else{
      sql.query(`Delete from container where id=${id} and hold_id is null or hold_id=" "`, (err, res) => {
        if (err) {
          console.log("error:", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ "message": "Data cannot be deleted either already deleted or has some item in it" }, null);
        }
        else {
          if(data_id.parent!=null){
            module.exports.getContainerbyID(data_id.parent,(err_parent,data_parent)=>{
              if(err_parent){
                result(err,null);
              }
              else{
                var hold = data_parent.hold_id;
                if ((hold == null) || (hold == '')) {
                  var ids = [];
                }
                else {
                  var ids = hold.split(',');
                }
                ids = ids.filter(item => item !== data_id.id.toString());
                hold = ids.join(',');
              const cont = new Container({
                hold_type: data_parent.hold_type,
                hold_id: hold,
                parent: data_parent.parent,
              });
              module.exports.updateById(data_parent.id, cont, (errors_from, data_update_from) => {
                if (errors_from) {
                  result(errors_from, null);
                  return;
                }
                else {
                  result(null, { "data": "Container Removed" });
              }
            });
          } 
        });
      }
         
          else{
          result(null, { "data": "Container Removed" });
          }
        }
      });
    }
  })

};
Container.isdeletable = (id,result) => {
  sql.query("select * from container where (hold_id is null or hold_id='') and id="+id, (err, data) => {

    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    else {
      if(data.length==0){
        result(null,null);
        return;
      }
      result(null, data);
      return;
    }
  });

};
Container.moveContainers = (to_move, from, to, result) => {
  module.exports.getContainerbyID(from, (err, data) => {

    if (err) {
      result(err, null);
    }
    else {
      module.exports.getContainerbyID(to_move, (err_move, data_move) => {
        if (err_move) {
          result(err_move, null);
          return;
        }
        else {

          module.exports.getContainerbyID(to, (err_to, data_to) => {
            if (err_to) {
              result(err_to, null);
              return;
            }
            else {
              if(data_move.hold_id!=data_to.hold_id){
                result({"message":"Not Allowed"});
              }
              if ((to_move == from) || (to_move == to) || (from == to)) {
                result({ "message": "Choose Different Containers" }, null);
              }

              var hold = data.hold_id;
              if ((hold == null) || (hold == '')) {
                var ids = [];
              }
              else {
                var ids = hold.split(',');
              }
 

              if (ids.indexOf(to_move.toString()) == -1) {
                result({ message: `${to_move} not present in ${from}` }, null);
                return;
              }
              module.exports.getAllItemsUnder([to_move],[],(err_under,data_under)=>{
                if(err_under){
                  result(err_under,null);
                  return;
                }
                else{

                  if(data_under.items_under.indexOf(to)!=-1){
                    result({"message":"Movement not allowed"},null);
                    return;
                  }

              ids = ids.filter(item => item !== to_move.toString());
              hold = ids.join(',');
              const cont = new Container({
                hold_type: data.hold_type,
                hold_id: hold,
                parent: data.parent
              });
              module.exports.updateById(from, cont, (errors_from, data_update_from) => {
                if (errors_from) {
                  result(errors_from, null);
                  return;
                }
                else {

                  const obj_to_move = new Container({
                    hold_type: data_move.hold_type,
                    hold_id: data_move.hold_id,
                    parent: to,
                  });
                  module.exports.updateById(to_move, obj_to_move, (errors_to_move, data_update_to_move) => {
                    if (errors_to_move) {
                      result(errors_to_move, null);
                      return;
                    }
                    else {

                      var hold = data_to.hold_id;
                      if ((hold == null) || (hold == '')) {
                        hold = to_move;
                      }
                      else {
                        hold += "," + to_move;
                      }
                      const obj_to = new Container({
                        hold_type: data_to.hold_type,
                        hold_id: hold,
                        parent: data_to.parent,
                      });
                      module.exports.updateById(to, obj_to, (errors, data_update) => {
                        if (errors) {
                          result(errors, null);
                          return;
                        }
                        else {
                          result(null, { "data": "MOVED CONTAINER" });
                          return;
                        }
                      });
                    }
                  });
                }
              });
            }
           
           
            });
           
            }
          });

        }
      });
    }
  })
}
Container.getAllItemsUnder = (to_process, processed, result) => {
  if (to_process.length == 0) {
    result(null, { items_under: processed });
  }
  else {
    var data = to_process.join(',');
    processed.push(...to_process);
    to_process = [];
    sql.query("select id,hold_id from container where parent in (" + data + ")", (err, data_to_process) => {
      if (err) {
        result(err, null);
        return;
      }
      else {
        console.log("data_to_process", data_to_process);
        for (i in data_to_process) {
          to_process.push(data_to_process[i].id);
        }
        module.exports.getAllItemsUnder(to_process, processed, result);
      }
    });
  }
}
Container.moveparentContainers=(to_move,to,result)=>{
  module.exports.getContainerbyID(to, (err, data_to) => {

    if (err) {
      result(err, null);
    }
    else {
      module.exports.getContainerbyID(to_move, (err_move, data_move) => {
        if (err_move) {
          result(err_move, null);
          return;
        }
        else {
          if (to_move == to)  {
            result({ "message": "Choose Different Containers" }, null);
          }
          module.exports.getAllItemsUnder([to_move],[],(err_under,data_under)=>{
            if(err_under){
              result(err_under,null);
              return;
            }
            else{

              if(data_under.items_under.indexOf(to)!=-1){
                result({"message":"Movement not allowed"},null);
                return;
              }
              
              const obj_to_move = new Container({
                hold_type: data_move.hold_type,
                hold_id: data_move.hold_id,
                parent: to,
              });
              module.exports.updateById(to_move, obj_to_move, (errors_to_move, data_update_to_move) => {
                if (errors_to_move) {
                  result(errors_to_move, null);
                  return;
                }
                else {

                  var hold = data_to.hold_id;
                  if ((hold == null) || (hold == '')) {
                    hold = to_move;
                  }
                  else {
                    hold += "," + to_move;
                  }
                  const obj_to = new Container({
                    hold_type: data_to.hold_type,
                    hold_id: hold,
                    parent: data_to.parent,
                  });
                  module.exports.updateById(to, obj_to, (errors, data_update) => {
                    if (errors) {
                      result(errors, null);
                      return;
                    }
                    else {
                      result(null, { "data": "MOVED CONTAINER" });
                      return;
                    }
                  });
                }
              });

        }
      });
    }
  });

}
  });
}
Container.possiblemovalecontainers=(id,result)=>{
  module.exports.getAllItemsUnder([id],[],(err,data)=>{
    if(err){
      result(err,null);
    }
    else{
      console.log(data);
     var s=data.items_under.join(',');
     console.log(s);
     sql.query("select label,id from container where id NOT IN("+s+") and hold_type=1",(err,data)=>{
       if(err){
         result(err,null);
       }
       else{
         result(null,data);
       }
     })
    }
  })
}

module.exports = Container;