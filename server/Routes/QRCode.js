import express from "express";
import { addQRCode, deleteQRCode, getQRCodes, scanQRCode, updateQRCode } from "../Controller/qrcode.js";
const router = express.Router();

router.post('/add-qrcode',addQRCode);
router.get('/get-qrcodes',getQRCodes);
router.get("/scan/:key", scanQRCode);
router.put('/update-qrcode/:id',updateQRCode);
router.delete('/delete-qrcode/:id',deleteQRCode);

export default router;