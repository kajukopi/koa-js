import User from "../models/User.js";

export default {
    getAllUsers: async (ctx) => {
        const users = await User.find({});
        ctx.body = users;
    },

    createUser: async (ctx) => {
        const newUser = new User(ctx.request.body);
        await newUser.save();
        ctx.body = newUser;
    },

    getUserById: async (ctx) => {
        const user = await User.findById(ctx.params.id);
        ctx.body = user;
    },

    updateUser: async (ctx) => {
        const updatedUser = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedUser;
    },

    deleteUser: async (ctx) => {
        await User.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },
}