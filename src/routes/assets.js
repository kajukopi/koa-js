import Router from "koa-router";
import controllerAssets from "../controller/controllerAssets.js";

const router = new Router({ prefix: '/assets' });

router.get('/', controllerAssets.getAllAssets);
router.post('/', controllerAssets.createAsset);
router.get('/:id', controllerAssets.getAssetById);
router.put('/:id', controllerAssets.updateAsset);
router.delete('/:id', controllerAssets.deleteAsset);

export default router
