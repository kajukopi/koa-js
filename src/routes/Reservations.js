import Router from "koa-routerReservations";
import controllerReservations from "../controller/controllerReservations.js";

const routerReservations = new Router({ prefix: '/reservations' });

routerReservations.get('/', controllerReservations.getAllReservations);
routerReservations.post('/', controllerReservations.createReservation);
routerReservations.get('/:id', controllerReservations.getReservationById);
routerReservations.put('/:id', controllerReservations.updateReservation);
routerReservations.delete('/:id', controllerReservations.deleteReservation);

export default routerReservations
