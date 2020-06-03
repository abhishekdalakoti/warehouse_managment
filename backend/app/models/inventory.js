const sql = require("./db.js");
const Container = require("./container.js");
const Inventory = function (inventory) {
  this.parent = typeof (inventory.parent) == 'undefined' ? null : inventory.parent;
  this.label = typeof (inventory.label) == 'undefined' ? null : inventory.label;
};
Inventory.create = (newinventory, result) => {

  var parent = newinventory.parent;
  Container.getContainerbyID(parent, (err, data) => {

    if (err) {
      if (err.kind == "not_found") {
        result({ "message": "This parent Container Dosent Exists" }, null);
        return;
      }
      result(err, null);
      return;
    }
    else {
      if (data.hold_type == 1) {
        result({ "message": "THIS Container only holds other containers" }, null);
        return;
      }
      sql.query("INSERT INTO inventory SET ?", newinventory, (error, res) => {
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
        Container.updateById(data.id, cont, (errors, data_update) => {
          if (errors) {
            result(errors, null);
            return;
          }
          else {
            console.log("created inventory: ", { id: res.insertId, ...newinventory });
            result(null, { id: res.insertId, ...newinventory });
          }
        });

      });
    }
  });
};
Inventory.getInventory = (result) => {
  sql.query("select inventory.*,wc.barcode_indentifier FROM inventory join warehouse_contents as wc on 2=wc.id", (err, data) => {

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
Inventory.deleteInventory=(id,result)=>{
  
}
Inventory.movetoContainer=(inventory_id, container_id, result)=> {
  Container.getContainerbyID(container_id, (err, data) => {

    if (err) {
      if (err.kind == "not_found") {
        result({ "message": "This parent Container Dosent Exists" }, null);
        return;
      }
      result(err, null);
      return;
    }
    else {
      if (data.hold_type == 1) {
        result({ "message": "THIS Container only holds other containers" }, null);
        return;
      }
      sql.query("Update inventory SET parent=? where id=?",[container_id,inventory_id], (error, res) => {
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
        Container.updateById(data.id, cont, (errors, data_update) => {
          if (errors) {
            result(errors, null);
            return;
          }
          else {
            console.log("Updated inventory: ", { id: res.insertId});
            result(null, { id: res.insertId });
          }
        });

      });
    }
  });
}
module.exports = Inventory;