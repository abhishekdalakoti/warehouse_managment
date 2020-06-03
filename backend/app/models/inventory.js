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
Inventory.getInventorybyID = (id, result) => {
  sql.query(`select inventory.*,wc.barcode_indentifier FROM inventory join warehouse_contents as wc on 2=wc.id WHERE inventory.id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found inventoryr: ", res[0]);

      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
}
Inventory.deleteInventory = (id, result) => {
  module.exports.getInventorybyID(id, (err, data_id) => {
    if (err) {
      result(err, null);
    }
    else {
      sql.query(`Delete from inventory where id=${id}`, (err, res) => {
        if (err) {
          console.log("error:", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ "message": "Data cannot be deleted either already deleted or has some item in it" }, null);
        }
        else {
          var parent = data_id.parent;
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
              var hold = data.hold_id;
              if ((hold == null) || (hold == '')) {
                var ids = [];
              }
              else {
                var ids = hold.split(',');
              }
              ids = ids.filter(item => item !== id.toString());
              hold = ids.join(',');
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
                  console.log("Deleted inventory: ", { id: id });
                  result(null, { id: res.insertId });
                }
              });
            }
          });
        }
      });
    }
  });
}
Inventory.movetoContainer = (inventory_id, container_id, result) => {

  module.exports.getInventorybyID(inventory_id, (err, data_inventory) => {
    if (err) {
      result(err, null);
    }
    else {

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
          sql.query("Update inventory SET parent=? where id=?", [container_id, inventory_id], (error, res) => {
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
                Container.getContainerbyID(data_inventory.parent, (err, data_parent) => {

                  if (err) {
                    if (err.kind == "not_found") {
                      result({ "message": "This parent Container Dosent Exists" }, null);
                      return;
                    }
                    result(err, null);
                    return;
                  }
                  else {
                    if (data_parent.hold_type == 1) {
                      result({ "message": "THIS Container only holds other containers" }, null);
                      return;
                    }
                    var hold = data_parent.hold_id;
                    if ((hold == null) || (hold == '')) {
                      var ids = [];
                    }
                    else {
                      var ids = hold.split(',');
                    }
                    ids = ids.filter(item => item !== data_inventory.id.toString());
                    hold = ids.join(',');
                    const cont = new Container({
                      hold_type: data_parent.hold_type,
                      hold_id: hold,
                      parent: data_parent.parent,
                    });
                    Container.updateById(data_parent.id, cont, (errors, data_update) => {
                      if (errors) {
                        result(errors, null);
                        return;
                      }
                      else {
                        console.log("Updated inventory: ");
                        result(null, { "data": "sucess" });
                      }
                    });


                  }
                  });

              
          }
  });
    });
  
      }
    })
}
  });
}
module.exports = Inventory;