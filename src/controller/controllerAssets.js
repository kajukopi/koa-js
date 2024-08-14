import Asset from "../models/Asset.js";

export default {
    getAllAssets: async (ctx) => {
        const assets = await Asset.find({});
        await ctx.render("assets", { assets })
    },

    createAsset: async (ctx) => {
        const newAsset = new Asset(ctx.request.body);
        await newAsset.save();
        await ctx.render("assets", { asset: newAsset })
    },

    getAssetById: async (ctx) => {
        const asset = await Asset.findById(ctx.params.id);
        await ctx.render("assets", { asset })
    },

    updateAsset: async (ctx) => {
        const updatedAsset = await Asset.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("assets", { asset: updatedAsset })
    },

    deleteAsset: async (ctx) => {
        await Asset.findByIdAndDelete(ctx.params.id);
        await ctx.render("assets", { asset: "deleted" })
    },

}
