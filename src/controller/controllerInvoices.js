import Invoice from "../models/Invoice.js";

export default {
    getAllInvoices: async (ctx) => {
        const invoices = await Invoice.find({});
        await ctx.render("invoices", { data: invoices, title: "Invoices" })
    },

    createInvoice: async (ctx) => {
        const newInvoice = new Invoice(ctx.request.body);
        await newInvoice.save();
        await ctx.render("invoices", { data: newInvoice, title: "Invoices" })
    },

    getInvoiceById: async (ctx) => {
        const invoice = await Invoice.findById(ctx.params.id);
        await ctx.render("invoices", { data: invoice, title: "Invoices" })
    },

    updateInvoice: async (ctx) => {
        const updatedInvoice = await Invoice.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
        await ctx.render("invoices", { data: updatedInvoice, title: "Invoices" })
    },

    deleteInvoice: async (ctx) => {
        await Invoice.findByIdAndDelete(ctx.params.id);
        await ctx.render("invoices", { data: "deleted", title: "Invoices" })
    },

}
