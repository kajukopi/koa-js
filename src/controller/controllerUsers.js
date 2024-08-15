import User from "../models/User.js";

export default {
    getAllUsers: async (ctx) => {
        const users = await User.find({}, 'username role').lean()
        const keys = []
        for (const key in users[0]) {
            const obj = {}
            if (Object.hasOwnProperty.call(users[0], key)) {
                obj['field'] = key
                obj['label'] = key.toUpperCase()
            }
            keys.push(obj)
        }
        await ctx.render("users", { data: users, keys, title: "Users" })
    },

    createUser: async (ctx) => {
        if (!ctx.request.body.password) ctx.request.body.password = "123456"
        const newUser = new User(ctx.request.body);
        await newUser.save();
        await ctx.render("users", { data: newUser, title: "Users" })
    },

    getUserById: async (ctx) => {
        const user = await User.findById(ctx.params.id);
        await ctx.render("users", { data: user, title: "Users" })
    },

    updateUser: async (ctx) => {
        let query = {}
        if (Object.keys(ctx.query)) query[[Object.keys(ctx.query)]] = ctx.params.id
        if (!Object.keys(ctx.query)) query['_id'] = ctx.params.id
        delete ctx.request.body["username"]
        delete ctx.request.body["password"]
        delete ctx.request.body["_id"]
        delete ctx.request.body["id"]
        const updatedUser = await User.findOneAndUpdate(query, ctx.request.body, { new: true });
        await ctx.render("users", { data: updatedUser, title: "Users" })
    },

    deleteUser: async (ctx) => {
        let query = {}
        if (Object.keys(ctx.query)) query[[Object.keys(ctx.query)]] = ctx.params.id
        if (!Object.keys(ctx.query)) query['_id'] = ctx.params.id
        await User.findOneAndDelete(query);
        await ctx.render("users", { data: "deleted", title: "Users" })
    },
}