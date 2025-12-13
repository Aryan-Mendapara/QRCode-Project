"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addQRCode } from "../apiServer/qrcode";
 
export default function AddQRPage() {
  const [key, setKey] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addQRCode({ key, url });
      alert("QR Added Successfully");
      router.push("/");
    } catch (err) {
      alert("Failed to add QR");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Add QR Code</h1>

        <input 
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <input
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
