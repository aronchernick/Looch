"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, CheckCircle, AlertCircle } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleJoin() {
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/family/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Invalid invite code");
      } else {
        setStatus("success");
        setMessage(`Joined ${data.family.name}!`);
        setTimeout(() => router.push("/"), 1500);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#1B3A5C" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#2A5F8A" }}>
            <Link2 size={28} color="white" />
          </div>
          <h1 className="text-white font-extrabold text-2xl">Join a Family</h1>
          <p className="text-blue-200 text-sm mt-1">Enter your invite code to sync calendars</p>
        </div>

        <div className="bg-white rounded-2xl p-5 space-y-4">
          <input
            type="text"
            placeholder="e.g. A3X9K2"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="w-full border rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest outline-none"
            style={{ borderColor: "#E5E5EA", color: "#1C1C1E" }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          {status === "success" && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#059669" }}>
              <CheckCircle size={16} /> {message}
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#DC2626" }}>
              <AlertCircle size={16} /> {message}
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={status === "loading" || !code.trim()}
            className="w-full py-3 rounded-xl font-bold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#6B1A1A" }}
          >
            {status === "loading" ? "Joining…" : "Join Family"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full text-sm text-center"
            style={{ color: "#8E8E93" }}
          >
            Back to calendar
          </button>
        </div>
      </div>
    </div>
  );
}
