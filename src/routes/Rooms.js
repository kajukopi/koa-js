import Router from "koa-routerRooms";
import controllerRooms from "../controller/controllerRooms.js";

const routerRooms = new Router({ prefix: '/rooms' });

routerRooms.get('/', controllerRooms.getAllRooms);
routerRooms.post('/', controllerRooms.createRoom);
routerRooms.get('/:id', controllerRooms.getRoomById);
routerRooms.put('/:id', controllerRooms.updateRoom);
routerRooms.delete('/:id', controllerRooms.deleteRoom);

export default routerRooms
