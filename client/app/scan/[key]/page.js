export const dynamic = "force-dynamic";

async function getQRData(key) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/scan/${key}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function QRRedirectPage({ params }) {
  const qr = await getQRData(params.key);

  if (!qr) {
    return (
      <div style={{ padding: 40 }}>
        <h1>QR Code Not Found</h1>
      </div>
    );
  }

  // ✅ SSR REDIRECT
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${qr.url}`} />
        <title>Redirecting...</title>
      </head>
      <body>
        <p>Redirecting to destination…</p>
      </body>
    </html>
  );
}
