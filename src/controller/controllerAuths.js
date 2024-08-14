import Auth from "../models/Auth.js";

export default {
    getAllAuths: async (ctx) => {
        const auths = await Auth.find({});
        await ctx.render("auths", { auths })
    },

    createAuth: async (ctx) => {
        const newAuth = new Auth(ctx.request.body);
        await newAuth.save();
        await ctx.render("auths", { auth: newAuth })
    },

    getAuthById: async (ctx) => {
        const auth = await Auth.findById(ctx.params.id);
        await ctx.render("auths", { auth })
    },

    updateAuth: async (ctx) => {
        const updatedAuth = await Auth.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("auths", { auth: updatedAuth })
    },

    deleteAuth: async (ctx) => {
        await Auth.findByIdAndDelete(ctx.params.id);
        await ctx.render("auths", { auth: "deleted" })
    },
}
