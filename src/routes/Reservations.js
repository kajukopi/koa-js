import Router from "koa-router";
import controllerReservations from "../controller/controllerReservations.js";

const router = new Router({ prefix: '/reservations' });

router.get('/', controllerReservations.getAllReservations);
router.post('/', controllerReservations.createReservation);
router.get('/:id', controllerReservations.getReservationById);
router.put('/:id', controllerReservations.updateReservation);
router.delete('/:id', controllerReservations.deleteReservation);

export default router
