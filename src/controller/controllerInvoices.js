import Invoice from "../models/Invoice.js";

export default {
    getAllInvoices: async (ctx) => {
        const invoices = await Invoice.find({});
        await ctx.render("invoices", { invoices })
    },

    createInvoice: async (ctx) => {
        const newInvoice = new Invoice(ctx.request.body);
        await newInvoice.save();
        await ctx.render("invoices", { invoice: newInvoice })
    },

    getInvoiceById: async (ctx) => {
        const invoice = await Invoice.findById(ctx.params.id);
        await ctx.render("invoices", { invoice })
    },

    updateInvoice: async (ctx) => {
        const updatedInvoice = await Invoice.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("invoices", { invoice: updatedInvoice })
    },

    deleteInvoice: async (ctx) => {
        await Invoice.findByIdAndDelete(ctx.params.id);
        await ctx.render("invoices", { invoice: "deleted" })
    },

}
