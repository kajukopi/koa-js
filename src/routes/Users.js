import Router from "koa-router";
import controllerUsers from "../controller/controllerUsers.js";

const router = new Router({ prefix: '/assets' });

router.get('/', controllerUsers.getAllUsers);
router.post('/', controllerUsers.createUser);
router.get('/:id', controllerUsers.getUserById);
router.put('/:id', controllerUsers.updateUser);
router.delete('/:id', controllerUsers.deleteUser);

export default router
