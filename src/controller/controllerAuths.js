import Auth from "../models/Auth.js";

export default {
    getAllAuths: async (ctx) => {
        const auths = await Auth.find({});
        ctx.body = auths;
    },

    createAuth: async (ctx) => {
        const newAuth = new Auth(ctx.request.body);
        await newAuth.save();
        ctx.body = newAuth;
    },

    getAuthById: async (ctx) => {
        const auth = await Auth.findById(ctx.params.id);
        ctx.body = auth;
    },

    updateAuth: async (ctx) => {
        const updatedAuth = await Auth.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedAuth;
    },

    deleteAuth: async (ctx) => {
        await Auth.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },
}
