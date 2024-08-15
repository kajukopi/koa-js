import Auth from "../models/Auth.js";

export default {
    getAllAuths: async (ctx) => {
        const auths = await Auth.find({}, '').lean();
        await ctx.render("auths", { data: auths, title: "Auth" })
    },

    createAuth: async (ctx) => {
        const newAuth = new Auth(ctx.request.body);
        await newAuth.save();
        await ctx.render("auths", { data: newAuth, title: "Auth" })
    },

    getAuthById: async (ctx) => {
        const auth = await Auth.findById(ctx.params.id);
        await ctx.render("auths", { data: auth, title: "Auth" })
    },

    updateAuth: async (ctx) => {
        const updatedAuth = await Auth.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("auths", { data: updatedAuth, title: "Auth" })
    },

    deleteAuth: async (ctx) => {
        await Auth.findByIdAndDelete(ctx.params.id);
        await ctx.render("auths", { data: "deleted", title: "Auth" })
    },
}
