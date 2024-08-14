import Service from "../models/Service.js";

export default {
    getAllServices: async (ctx) => {
        const services = await Service.find({});
        ctx.body = services;
    },

    createService: async (ctx) => {
        const newService = new Service(ctx.request.body);
        await newService.save();
        ctx.body = newService;
    },

    getServiceById: async (ctx) => {
        const service = await Service.findById(ctx.params.id);
        ctx.body = service;
    },

    updateService: async (ctx) => {
        const updatedService = await Service.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedService;
    },

    deleteService: async (ctx) => {
        await Service.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },

}