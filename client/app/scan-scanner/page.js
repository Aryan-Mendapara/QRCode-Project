"use client";
export const dynamic = 'force-dynamic';

import { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";
import { useSearchParams } from "next/navigation";

export default function ScanUploadPage() {
    const [imgSrc, setImgSrc] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [linkDetected, setLinkDetected] = useState(false);
    const [finalUrl, setFinalUrl] = useState("");

    const canvasRef = useRef();
    const fileInputRef = useRef();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode"); // 'add' or 'remove'

    // Load saved image & QR data from localStorage
    useEffect(() => {
        const savedImg = localStorage.getItem("qrImage");
        const savedData = localStorage.getItem("qrData");

        if (savedImg) {
            setImgSrc(savedImg);
            const img = new Image();
            img.src = savedImg;

            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                if (savedData) {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) drawBoundingBox(ctx, code);
                }
            };
        }

        if (savedData) {
            setQrData(savedData);
            setLinkDetected(savedData.startsWith("http"));
            setFinalUrl(getFinalUrl(savedData));
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgSrcValue = event.target.result;
            setImgSrc(imgSrcValue);
            setQrData(null);
            setLinkDetected(false);
            localStorage.setItem("qrImage", imgSrcValue);

            const img = new Image();
            img.src = imgSrcValue;

            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    setQrData(code.data);
                    setLinkDetected(code.data.startsWith("http"));
                    localStorage.setItem("qrData", code.data);
                    setFinalUrl(getFinalUrl(code.data));
                    drawBoundingBox(ctx, code);
                } else {
                    setQrData("No QR code detected.");
                    setLinkDetected(false);
                    setFinalUrl("");
                    localStorage.removeItem("qrData");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const handleClear = () => {
        setImgSrc(null);
        setQrData(null);
        setLinkDetected(false);
        setFinalUrl("");
        localStorage.removeItem("qrImage");
        localStorage.removeItem("qrData");

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const drawBoundingBox = (ctx, code) => {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
        ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
        ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
        ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
        ctx.closePath();
        ctx.stroke();
    };

    const getFinalUrl = (data) => {
        if (!data) return "";
        const segments = data.split("/");
        const id = segments[segments.length - 1];

        if (mode === "add") return `https://acdc2.canvusapps.com/ims/aamsuratgujarat/catalogs#addinventory/${id}`;
        if (mode === "remove") return `https://acdc2.canvusapps.com/ims/aamsuratgujarat/catalogs#removeinventory/${id}`;
        return `https://acdc2.canvusapps.com/ims/aamsuratgujarat/catalogs#item/show/${id}`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Upload & Scan QR Code</h1>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                >
                    Upload File
                </button>

                <button
                    onClick={handleClear}
                    className="py-2 px-6 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                >
                    Clear
                </button>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <canvas
                ref={canvasRef}
                style={{ display: imgSrc ? "block" : "none", maxWidth: "100%", maxHeight: "400px" }}
            />

            {qrData && (
                <div className="mt-4 bg-gray-100 text-black p-4 rounded shadow w-full max-w-md text-center">
                    <p className="mb-2 break-all"><b>QR Data:</b> {qrData}</p>
                    {linkDetected && finalUrl && (
                        <button
                            onClick={() => window.location.href = finalUrl}
                            className="text-white py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition cursor-pointer"
                        >
                            Open Website
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
