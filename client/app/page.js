"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import { deleteQRCode, getQRCodes, updateQRCode } from "./apiServer/qrcode";

export default function HomePage() {
  const [qrList, setQrList] = useState([]);
  const [showQRIndex, setShowQRIndex] = useState(null);
  const [updateItem, setUpdateItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getQRCodes();
      setQrList(res.data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteQRCode(id);
    loadData();
  };

  const handleUpdate = async () => {
    await updateQRCode(updateItem.id, {
      key: updateItem.key,
      url: updateItem.url,
    });
    setUpdateItem(null);
    loadData();
  };

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">QR Code Manager</h1>

      <div className="flex flex-col md:flex-row justify-center mb-6 gap-4">
        <Link
          href="/add"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
        >
          Add QR Code
        </Link>
        <Link
          href="/scan-scanner"
          target="_blank"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"
        >
          Scan QR Code
        </Link>
        <Link
          href="/scan-scanner?mode=add"
          target="_blank"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
        >
          Scan & Add
        </Link>
        <Link
          href="/scan-scanner?mode=remove"
          target="_blank"
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow"
        >
          Scan & Remove
        </Link>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Key</th>
              <th className="border px-4 py-2">URL</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {qrList.map((item, index) => (
              <tr key={item.id} className="text-center border">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.key}</td>
                <td className="border px-4 py-2 truncate max-w-xs">{item.url}</td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setShowQRIndex(index)}
                      className="btn-sm bg-green-500"
                    >
                      Show
                    </button>
                    <button
                      onClick={() => setUpdateItem(item)}
                      className="btn-sm bg-yellow-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-sm bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {qrList.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 shadow">
            <p><b>No:</b> {index + 1}</p>
            <p><b>Key:</b> {item.key}</p>
            <p className="break-all"><b>URL:</b> {item.url}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowQRIndex(index)}
                className="btn-sm px-2 py-1 bg-green-500 rounded"
              >
                Show
              </button>
              <button
                onClick={() => setUpdateItem(item)}
                className="btn-sm px-2 py-1 bg-yellow-500 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="btn-sm px-2 py-1 bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= QR MODAL ================= */}
      {showQRIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded text-center">
            <QRCodeCanvas
              value={`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/scan/${qrList[showQRIndex].key}`}
              size={200}
            />
            <button
              onClick={() => setShowQRIndex(null)}
              className="btn bg-blue-600 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= UPDATE MODAL ================= */}
      {updateItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Update QR Code</h2>

            <input
              className="input"
              value={updateItem.key}
              onChange={(e) => setUpdateItem({ ...updateItem, key: e.target.value })}
            />
            <input
              className="input mt-3"
              value={updateItem.url}
              onChange={(e) => setUpdateItem({ ...updateItem, url: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setUpdateItem(null)}
                className="btn-sm bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn-sm bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}