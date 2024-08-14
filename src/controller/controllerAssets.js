import Asset from "../models/Asset.js";

export default {
    getAllAssets: async (ctx) => {
        const assets = await Asset.find({});
        ctx.body = assets;
    },

    createAsset: async (ctx) => {
        const newAsset = new Asset(ctx.request.body);
        await newAsset.save();
        ctx.body = newAsset;
    },

    getAssetById: async (ctx) => {
        const asset = await Asset.findById(ctx.params.id);
        ctx.body = asset;
    },

    updateAsset: async (ctx) => {
        const updatedAsset = await Asset.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedAsset;
    },

    deleteAsset: async (ctx) => {
        await Asset.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },

}
