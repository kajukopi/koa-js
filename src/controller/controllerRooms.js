import Room from "../models/Room.js";

export default {
    getAllRooms: async (ctx) => {
        const rooms = await Room.find({}, '').lean();
        await ctx.render("rooms", { data: rooms, title: "Rooms" })
    },

    createRoom: async (ctx) => {
        const newRoom = new Room(ctx.request.body);
        await newRoom.save();
        await ctx.render("rooms", { data: newRoom, title: "Rooms" })
    },

    getRoomById: async (ctx) => {
        const room = await Room.findById(ctx.params.id);
        await ctx.render("rooms", { data: room, title: "Rooms" })
    },

    updateRoom: async (ctx) => {
        const updatedRoom = await Room.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("rooms", { data: updatedRoom, title: "Rooms" })
    },

    deleteRoom: async (ctx) => {
        await Room.findByIdAndDelete(ctx.params.id);
        await ctx.render("rooms", { data: "deleted", title: "Rooms" })
    },

}