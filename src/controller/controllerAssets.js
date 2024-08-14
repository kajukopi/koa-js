const Asset = require('../models/Asset');

exports.getAllAssets = async (ctx) => {
    const assets = await Asset.find({});
    ctx.body = assets;
};

exports.createAsset = async (ctx) => {
    const newAsset = new Asset(ctx.request.body);
    await newAsset.save();
    ctx.body = newAsset;
};

exports.getAssetById = async (ctx) => {
    const asset = await Asset.findById(ctx.params.id);
    ctx.body = asset;
};

exports.updateAsset = async (ctx) => {
    const updatedAsset = await Asset.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = updatedAsset;
};

exports.deleteAsset = async (ctx) => {
    await Asset.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
};
