import Image from "next/image";

export default function WaitlistPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0a1020" }}>
      <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "4rem", textAlign: "center", marginBottom: "2rem", letterSpacing: 1 }}>
        Take Control of Your Health Today
      </h1>
      <Image
        src="/images/waitlist-qr.png"
        alt="Join the waitlist QR code"
        width={300}
        height={300}
        priority
        style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.2)", borderRadius: 16, background: "#fff" }}
      />
    </div>
  );
} 