// src/routes/assets.js

import Router from "koa-router";
import controllerAssets from "../controller/controllerAssets.js";

const routerAssets = new Router({ prefix: '/assets' });

routerAssets.get('/', controllerAssets.getAllAssets);
routerAssets.post('/', controllerAssets.createAsset);
routerAssets.get('/:id', controllerAssets.getAssetById);
routerAssets.put('/:id', controllerAssets.updateAsset);
routerAssets.delete('/:id', controllerAssets.deleteAsset);

export default routerAssets
