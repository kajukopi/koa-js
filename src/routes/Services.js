import Router from "koa-router";
import controllerServices from "../controller/controllerServices.js";

const router = new Router({ prefix: '/services' });

router.get('/', controllerServices.getAllServices);
router.post('/', controllerServices.createService);
router.get('/:id', controllerServices.getServiceById);
router.put('/:id', controllerServices.updateService);
router.delete('/:id', controllerServices.deleteService);

export default router
