import express from "express";
import qrCodeRoutes from "./QRCode.js";

const router = express.Router();

// mount QR code routes (parent prefix is set in server/index.js)
router.use("/qrcode", qrCodeRoutes);

export default router; 