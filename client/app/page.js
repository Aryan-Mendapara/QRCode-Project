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
      <h1 className="text-4xl font-bold mb-8 text-center">QR Code Manager</h1>

      <div className="flex justify-center mb-6 gap-4">
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
      </div>

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
              <td className="border px-4 py-2 break-all">{item.url}</td>
              <td className="px-4 py-2 flex justify-center gap-2">
                <button
                  onClick={() =>
                    setShowQRIndex(showQRIndex === index ? null : index)
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer"
                >
                  Show
                </button>
                <button
                  onClick={() => setUpdateItem(item)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show QR Modal */}
      {showQRIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow text-center">
            <QRCodeCanvas
              value={`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/scan/${qrList[showQRIndex].key}`}
              size={200}
            />
            <button
              onClick={() => setShowQRIndex(null)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 text-black p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Update QR Code</h2>
            <input
              className="border p-2 w-full mb-3 rounded"
              value={updateItem.key}
              onChange={(e) =>
                setUpdateItem({ ...updateItem, key: e.target.value })
              }
            />
            <input
              className="border p-2 w-full mb-3 rounded"
              value={updateItem.url}
              onChange={(e) =>
                setUpdateItem({ ...updateItem, url: e.target.value })
              }
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUpdateItem(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
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
