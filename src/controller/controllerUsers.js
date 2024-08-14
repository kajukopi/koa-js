const User = require('../models/User');

exports.getAllUsers = async (ctx) => {
    const users = await User.find({});
    ctx.body = users;
};

exports.createUser = async (ctx) => {
    const newUser = new User(ctx.request.body);
    await newUser.save();
    ctx.body = newUser;
};

exports.getUserById = async (ctx) => {
    const user = await User.findById(ctx.params.id);
    ctx.body = user;
};

exports.updateUser = async (ctx) => {
    const updatedUser = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = updatedUser;
};

exports.deleteUser = async (ctx) => {
    await User.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
};
