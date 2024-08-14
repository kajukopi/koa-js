import Room from "../models/Room.js";

export default {
    getAllRooms: async (ctx) => {
        const rooms = await Room.find({});
        await ctx.render("rooms", { rooms })
    },

    createRoom: async (ctx) => {
        const newRoom = new Room(ctx.request.body);
        await newRoom.save();
        await ctx.render("rooms", { room: newRoom })
    },

    getRoomById: async (ctx) => {
        const room = await Room.findById(ctx.params.id);
        await ctx.render("rooms", { room })
    },

    updateRoom: async (ctx) => {
        const updatedRoom = await Room.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("rooms", { room: updatedRoom })
    },

    deleteRoom: async (ctx) => {
        await Room.findByIdAndDelete(ctx.params.id);
        await ctx.render("rooms", { room: "deleted" })
    },

}