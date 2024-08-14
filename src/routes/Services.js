import Router from "koa-routerServices";
import controllerServices from "../controller/controllerServices.js";

const routerServices = new Router({ prefix: '/services' });

routerServices.get('/', controllerServices.getAllServices);
routerServices.post('/', controllerServices.createService);
routerServices.get('/:id', controllerServices.getServiceById);
routerServices.put('/:id', controllerServices.updateService);
routerServices.delete('/:id', controllerServices.deleteService);

export default routerServices
