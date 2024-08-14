const Invoice = require('../models/Invoice');

exports.getAllInvoices = async (ctx) => {
    const invoices = await Invoice.find({});
    ctx.body = invoices;
};

exports.createInvoice = async (ctx) => {
    const newInvoice = new Invoice(ctx.request.body);
    await newInvoice.save();
    ctx.body = newInvoice;
};

exports.getInvoiceById = async (ctx) => {
    const invoice = await Invoice.findById(ctx.params.id);
    ctx.body = invoice;
};

exports.updateInvoice = async (ctx) => {
    const updatedInvoice = await Invoice.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.body = updatedInvoice;
};

exports.deleteInvoice = async (ctx) => {
    await Invoice.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
};
