// src/routes/auths.js

import Router from "koa-router";
import controllerAuths from "../controller/controllerAuths.js";

const routerAuths = new Router({ prefix: '/auths' });

routerAuths.get('/', controllerAuths.getAllAuths);
routerAuths.post('/', controllerAuths.createAuth);
routerAuths.get('/:id', controllerAuths.getAuthById);
routerAuths.put('/:id', controllerAuths.updateAuth);
routerAuths.delete('/:id', controllerAuths.deleteAuth);

export default routerAuths
