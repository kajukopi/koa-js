import Router from "koa-router";
import controllerRooms from "../controller/controllerRooms.js";

const router = new Router({ prefix: '/rooms' });

router.get('/', controllerRooms.getAllRooms);
router.post('/', controllerRooms.createRoom);
router.get('/:id', controllerRooms.getRoomById);
router.put('/:id', controllerRooms.updateRoom);
router.delete('/:id', controllerRooms.deleteRoom);

export default router
