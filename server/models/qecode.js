import pkg from "pg";
const { Pool } = pkg;

let pool;

export const initializePool = () => {
    console.log("📌 Initializing Pool with: ", {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        port: process.env.PG_PORT,
    });

    pool = new Pool({ 
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: String(process.env.PG_PASSWORD),
        port: Number(process.env.PG_PORT),
    });
}

//Get the pool instance
export const getPool = () => {
    if (!pool) {
        throw new Error("Pool not initialized. Call initializePool first.");
    }
    return pool;
}

// Initialize the QR Codes table
export const initializeTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS qrcodes (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) UNIQUE NOT NULL,
                url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await getPool().query(query);
        console.log("✅ QR Codes table is ready.");
    } catch (error) {
        console.error("❌ Error initializing QR Codes table:", error);
        throw error;
    }
}

// insert QRCode into DB
export const insertQRCode = async (data) => {
    try {
        const query = `
        INSERT INTO qrcodes (key, url)
        VALUES ($1, $2)
        RETURNING *;
        `;
        const values = [
            data.key,
            data.url
        ];

        const res = await getPool().query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error("❌ Error inserting QR Code:", error);
        throw error;
    }
}

// get all QRCodes from DB
export const getAllQRCodes = async () => {
    try {
        const query = `
            SELECT * FROM qrcodes 
            ORDER BY created_at DESC;
        `;
        const res = await getPool().query(query);
        return res.rows;
    } catch (error) {
        console.error("❌ Error fetching QR Codes:", error);
        throw error;
    }
}

// get QRCode by key from DB
export const getQRCodeByKey = async (key) => {
    const query = `SELECT * FROM qrcodes WHERE key = $1`;
    const res = await getPool().query(query, [key]);
    return res.rows[0];
};


// update QRCode in DB
export const updateQRCodeById = async (id, data) => {
    try {
        const query = `
            UPDATE qrcodes
            SET key = $1, url = $2
            WHERE id = $3
            RETURNING *;
        `;
        const values = [data.key, data.url, id];
        const res = await getPool().query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error("❌ Error updating QR Code:", error);
        throw error;
    }
};

// delete QRCode from DB
export const deleteQRCodeById = async (id) => {
    try {
        const query = `DELETE FROM qrcodes WHERE id = $1 RETURNING *;`;
        const res = await getPool().query(query, [id]);
        return res.rows[0];
    } catch (error) {
        console.error("❌ Error deleting QR Code:", error);
        throw error;
    }
};