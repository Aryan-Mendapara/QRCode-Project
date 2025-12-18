"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addQRCode } from "../apiServer/qrcode";

export default function AddQRPage() {
  const [key, setKey] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await addQRCode({ key, url });
      alert("QR Added Successfully");
      router.push("/");
    } catch (err) {
      alert("Failed to add QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center  transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow max-w-md w-full transition-colors duration-300"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Add QR Code
        </h1>

        <input
          className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 mb-4 rounded bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />

        <input
          className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 mb-4 rounded bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
