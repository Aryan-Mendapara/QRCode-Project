import axios from "axios";

export const addQRCode = async (data) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/add-qrcode`,
            data
        );
        return response.data;
    } catch (error) {
        console.error("Error adding qrcode :", error);
        throw error;
    }
};

export const getQRCodes = async () => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/get-qrcodes`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching qrcodes :", error);
        throw error;
    }
}
 
export const updateQRCode = async (id, data) => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/update-qrcode/${id}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error("Error updating qrcode :", error);
        throw error;
    }
};

export const deleteQRCode = async (id) => {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/delete-qrcode/${id}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting qrcode :", error);
        throw error;
    }
};

export const scanQRCode = async (key) => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/scan/${key}`
        );
        return res.data;
    } catch (error) {
        console.error("Error scanning QR code:", error);
        throw error;
    }
};