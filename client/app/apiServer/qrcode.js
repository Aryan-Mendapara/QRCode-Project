import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + "/project/qrcode";

// Add QR Code
export const addQRCode = async (data) => {
  try {
    const response = await axios.post(`${API_BASE}/add-qrcode`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding QR code:", error);
    throw error;
  }
};

// Get all QR Codes
export const getQRCodes = async () => {
  try {
    const response = await axios.get(`${API_BASE}/get-qrcodes`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching QR codes:", error);
    throw error;
  }
};

// Update QR Code by ID
export const updateQRCode = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE}/update-qrcode/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating QR code:", error);
    throw error;
  }
};

// Delete QR Code by ID
export const deleteQRCode = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/delete-qrcode/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting QR code:", error);
    throw error;
  }
};

// Scan QR Code by key
export const scanQRCode = async (key) => {
  try {
    const response = await axios.get(`${API_BASE}/scan/${key}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error scanning QR code:", error);
    throw error;
  }
};
