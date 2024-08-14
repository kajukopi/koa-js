import Router from "koa-routerUsers";
import controllerUsers from "../controller/controllerUsers.js";

const routerUsers = new Router({ prefix: '/assets' });

routerUsers.get('/', controllerUsers.getAllUsers);
routerUsers.post('/', controllerUsers.createUser);
routerUsers.get('/:id', controllerUsers.getUserById);
routerUsers.put('/:id', controllerUsers.updateUser);
routerUsers.delete('/:id', controllerUsers.deleteUser);

export default { routerUsers }
