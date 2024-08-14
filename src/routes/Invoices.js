// src/routes/invoices.js

import Router from "koa-router";
import controllerInvoices from "../controller/controllerInvoices.js";

const routerInvoices = new Router({ prefix: '/invoices' });

routerInvoices.get('/', controllerInvoices.getAllInvoices);
routerInvoices.post('/', controllerInvoices.createInvoice);
routerInvoices.get('/:id', controllerInvoices.getInvoiceById);
routerInvoices.put('/:id', controllerInvoices.updateInvoice);
routerInvoices.delete('/:id', controllerInvoices.deleteInvoice);

export default routerInvoices
