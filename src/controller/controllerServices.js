const Service = require('../models/Service');

exports.getAllServices = async (ctx) => {
    const services = await Service.find({});
    ctx.body = services;
};

exports.createService = async (ctx) => {
    const newService = new Service(ctx.request.body);
    await newService.save();
    ctx.body = newService;
};

exports.getServiceById = async (ctx) => {
    const service = await Service.findById(ctx.params.id);
    ctx.body = service;
};

exports.updateService = async (ctx) => {
    const updatedService = await Service.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = updatedService;
};

exports.deleteService = async (ctx) => {
    await Service.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
};
