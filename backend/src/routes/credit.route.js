import express from "express";
import { getCreditBalance, purchaseCredits, createOrder, verifyPayment } from "../controllers/credit.controller.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/balance", requireAuth(), getCreditBalance);
router.post("/purchase", requireAuth(), purchaseCredits);
router.post("/create-order", requireAuth(), createOrder);
router.post("/verify-payment", requireAuth(), verifyPayment);

export default router;

