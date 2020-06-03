module.exports = app => {
  const containers = require("../controller/container.js");
  const inventory = require("../controller/inventory.js");
  app.post("/container", containers.createcontainer);
  app.get("/movablecontainer/:type",containers.getContainerbytype);
  app.get("/container", containers.getContainers);
  app.get("/container/:id",containers.getContainerbyId);
  app.get("/deletecontainer/:id",containers.deleteContainer);
  app.get("/getdeleteablecontainer/:id",containers.getDeletableContainers);
  app.post("/movecontainer",containers.movecontainer);
  app.get("/allelemrntunder/:id",containers.getallelementsunder);
  app.post("/inventory", inventory.createinventory);
  app.get("/inventory",inventory.getInventory);
  app.get('/possiblemovablecontainers/:id',containers.possiblemovablecontainers);
};