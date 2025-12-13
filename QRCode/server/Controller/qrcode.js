import { deleteQRCodeById, getAllQRCodes, getQRCodeByKey, insertQRCode, updateQRCodeById } from "../Models/qrcode.js";

export const addQRCode = async (req, res) => {
    try {
        const requried = [
            "key", "url"
        ];

        // Check for missing fields
        for (const field of requried) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing field: ${field}` });
            } 
        }

        const savedQR = await insertQRCode(req.body);

        res.status(201).json({
            message: "QR Code added successfully",
            data: savedQR
        });
    } catch (error) {
        console.error("❌ Error in addQRCode controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getQRCodes = async (req, res) => {
    try {
        const qrcodes = await getAllQRCodes();
        res.status(200).json({
            message: "QRCodes fetched successfully",
            data: qrcodes
        });
    } catch (error) {
        console.error("❌ Error in getQRCodes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const scanQRCode = async (req, res) => {
    try {
        const { key } = req.params;

        const qr = await getQRCodeByKey(key);

        if (!qr) {
            return res.status(404).json({ error: "QR not found" });
        }

        // Redirect to the current URL stored in database        
        res.redirect(qr.url);
    } catch (error) {
        console.error("❌ Error in scanQRCode:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const updateQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateQRCodeById(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: "QR Code not found" });
        }

        res.status(200).json({
            message: "QR Code updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("❌ Error in updateQRCode:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteQRCodeById(id);

        if (!deleted) {
            return res.status(404).json({ error: "QR Code not found" });
        }

        res.status(200).json({
            message: "QR Code deleted successfully",
            data: deleted,
        });
    } catch (error) {
        console.error("❌ Error in deleteQRCode:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};