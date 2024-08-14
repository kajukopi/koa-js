import User from "../models/User.js";

export default {
    getAllUsers: async (ctx) => {
        const users = await User.find({});
        await ctx.render("users", { users })
    },

    createUser: async (ctx) => {
        const newUser = new User(ctx.request.body);
        await newUser.save();
        await ctx.render("users", { user: newUser })
    },

    getUserById: async (ctx) => {
        const user = await User.findById(ctx.params.id);
        await ctx.render("users", { user })
    },

    updateUser: async (ctx) => {
        const updatedUser = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("users", { user: updatedUser })
    },

    deleteUser: async (ctx) => {
        await User.findByIdAndDelete(ctx.params.id);
        await ctx.render("users", { user: "deleted" })
    },
}