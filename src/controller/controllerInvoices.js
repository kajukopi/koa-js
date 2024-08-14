import Invoice from "../models/Invoice.js";

export default {
    getAllInvoices: async (ctx) => {
        const invoices = await Invoice.find({});
        ctx.body = invoices;
    },

    createInvoice: async (ctx) => {
        const newInvoice = new Invoice(ctx.request.body);
        await newInvoice.save();
        ctx.body = newInvoice;
    },

    getInvoiceById: async (ctx) => {
        const invoice = await Invoice.findById(ctx.params.id);
        ctx.body = invoice;
    },

    updateInvoice: async (ctx) => {
        const updatedInvoice = await Invoice.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        ctx.body = updatedInvoice;
    },

    deleteInvoice: async (ctx) => {
        await Invoice.findByIdAndDelete(ctx.params.id);
        ctx.status = 204;
    },

}
