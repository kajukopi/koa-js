import Asset from "../models/Asset.js";

export default {
    getAllAssets: async (ctx) => {
        const assets = await Asset.find({}, '').lean();
        await ctx.render("assets", { data: assets, title: "Assets" })
    },

    createAsset: async (ctx) => {
        const newAsset = new Asset(ctx.request.body);
        await newAsset.save();
        await ctx.render("assets", { data: newAsset, title: "Assets" })
    },

    getAssetById: async (ctx) => {
        const asset = await Asset.findById(ctx.params.id);
        await ctx.render("assets", { data: asset, title: "Assets" })
    },

    updateAsset: async (ctx) => {
        const updatedAsset = await Asset.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("assets", { data: updatedAsset, title: "Assets" })
    },

    deleteAsset: async (ctx) => {
        await Asset.findByIdAndDelete(ctx.params.id);
        await ctx.render("assets", { data: "deleted", title: "Assets" })
    },

}
