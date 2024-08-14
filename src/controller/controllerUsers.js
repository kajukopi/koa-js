import User from "../models/User.js";

export default {
    getAllUsers: async (ctx) => {
        const users = await User.find({});
        await ctx.render("users", { data: users, title: "Users" })
    },

    createUser: async (ctx) => {
        const newUser = new User(ctx.request.body);
        await newUser.save();
        await ctx.render("users", { data: newUser, title: "Users" })
    },

    getUserById: async (ctx) => {
        const user = await User.findById(ctx.params.id);
        await ctx.render("users", { data: user, title: "Users" })
    },

    updateUser: async (ctx) => {
        const updatedUser = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("users", { data: updatedUser, title: "Users" })
    },

    deleteUser: async (ctx) => {
        await User.findByIdAndDelete(ctx.params.id);
        await ctx.render("users", { data: "deleted", title: "Users" })
    },
}