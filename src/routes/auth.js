import Router from "koa-router";
import controllerAuths from "../controller/controllerAuths.js";

const router = new Router({ prefix: '/auths' });

router.get('/', controllerAuths.getAllAuths);
router.post('/', controllerAuths.createAuth);
router.get('/:id', controllerAuths.getAuthById);
router.put('/:id', controllerAuths.updateAuth);
router.delete('/:id', controllerAuths.deleteAuth);

export default router
