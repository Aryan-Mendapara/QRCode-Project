"use client";
export const dynamic = "force-dynamic";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import jsQR from "jsqr";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanUploadPage() {
    const [imgSrc, setImgSrc] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [linkDetected, setLinkDetected] = useState(false);
    const [finalUrl, setFinalUrl] = useState("");
    const [cameraOn, setCameraOn] = useState(false);
    const [heading, setHeading] = useState("Upload / Scan QR Code");

    const canvasRef = useRef();
    const fileInputRef = useRef();
    const qrRef = useRef(null);

    const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
    const mode = searchParams?.get("mode");

    useEffect(() => {
        if (!searchParams) return;
        if (mode === "add") setHeading("Upload / Scan QR Code - Add Inventory");
        else if (mode === "remove") setHeading("Upload / Scan QR Code - Remove Inventory");
    }, [searchParams, mode]);

    /* ================= IMAGE UPLOAD ================= */

    const handleFileChange = (e) => {
        if (cameraOn) return; // 🔹 camera already active, ignore upload

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgSrcValue = event.target.result;
            setImgSrc(imgSrcValue);
            setQrData(null);
            setLinkDetected(false);

            const img = new Image();
            img.src = imgSrcValue;

            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    setQrData(code.data);
                    setLinkDetected(code.data.startsWith("http"));
                    setFinalUrl(getFinalUrl(code.data));

                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
                    ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
                    ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
                    ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
                    ctx.closePath();
                    ctx.stroke();
                } else {
                    setQrData("No QR code detected");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    /* ================= CAMERA SCAN ================= */

    useEffect(() => {
        if (!cameraOn) return;

        // 🔹 If image is uploaded, disable camera
        if (imgSrc) {
            setCameraOn(false);
            return;
        }

        const html5QrCode = new Html5Qrcode("qr-reader");
        qrRef.current = html5QrCode;

        html5QrCode
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 400 },
                async (decodedText) => {
                    // 🔹 Stop and clear scanner
                    await html5QrCode.stop();
                    await html5QrCode.clear();
                    setCameraOn(false);

                    // 🔹 Set state (optional)
                    setQrData(decodedText);
                    setLinkDetected(decodedText.startsWith("http"));
                    setFinalUrl(getFinalUrl(decodedText));

                    // 🔹 Automatic redirect if link
                    if (decodedText.startsWith("http")) {
                        window.location.href = getFinalUrl(decodedText); // 🔹 auto open
                    }
                }
            )

    }, [cameraOn, imgSrc]);

    /* ================= COMMON ================= */

    const getFinalUrl = (data) => {
        if (!data) return "";
        const id = data.split("/").pop();

        if (mode === "add")
            return `https://acdc2.canvusapps.com/ims/aamsuratgujarat/catalogs#addinventory/${id}`;
        if (mode === "remove")
            return `https://acdc2.canvusapps.com/ims/aamsuratgujarat/catalogs#removeinventory/${id}`;
        return `https://acdc2.canvusapps.com/ims/aamsuratgujarat/catalogs#item/show/${id}`;
    };

    const handleClear = async () => {
        if (qrRef.current) {
            try {
                if (qrRef.current.isScanning) await qrRef.current.stop();
                qrRef.current.clear();
            } catch (e) {
                console.warn("Camera already stopped");
            }
            qrRef.current = null;
        }

        setCameraOn(false);
        setImgSrc(null);
        setQrData(null);
        setLinkDetected(false);
        setFinalUrl("");

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">{heading}</h1>

            <div className="flex gap-2 mb-4">
                {/* 🔹 Upload Image button only if camera is OFF */}
                {!cameraOn && (
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Upload Image
                    </button>
                )}

                {/* 🔹 Camera button only if no image uploaded */}
                {!imgSrc && (
                    <button
                        onClick={() => setCameraOn(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    >
                        Open Camera
                    </button>
                )}

                <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                    Clear
                </button>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
            />

            {/* ================= UI ================= */}
            <canvas
                ref={canvasRef}
                className="shadow-md"
                style={{
                    width: imgSrc ? "500px" : "0px",  // 🔹 Upload image width
                    height: imgSrc ? "400px" : "0px", // 🔹 Upload image height
                    maxWidth: "100%",
                    objectFit: "cover",
                }}
            />

            {cameraOn && (
                <div
                    id="qr-reader"
                    className="rounded-lg shadow-md mt-4"
                    style={{
                        width: "350px",   // 🔹 smaller size for camera
                        height: "250px",  // 🔹 smaller height
                        overflow: "hidden",
                    }}
                />
            )}

            {cameraOn && !imgSrc && (
                <div
                    id="qr-reader"
                    className="rounded-lg shadow-md mt-4"
                    style={{ width: "600px", height: "450px" }}
                />
            )}

            {qrData && (
                <div className="mt-4 bg-gray-100 text-black p-4 rounded text-center w-full max-w-md">
                    <p className="break-all mb-3"><b>QR Data:</b> {qrData}</p>
                    {linkDetected && finalUrl && (
                        <button
                            onClick={() => window.location.href = finalUrl}
                            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            Open Website
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
