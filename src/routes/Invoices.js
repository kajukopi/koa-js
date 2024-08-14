import Router from "koa-router";
import controllerInvoices from "../controller/controllerInvoices.js";

const router = new Router({ prefix: '/invoices' });

router.get('/', controllerInvoices.getAllInvoices);
router.post('/', controllerInvoices.createInvoice);
router.get('/:id', controllerInvoices.getInvoiceById);
router.put('/:id', controllerInvoices.updateInvoice);
router.delete('/:id', controllerInvoices.deleteInvoice);

export default router
