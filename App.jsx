import { useState, useRef, useCallback } from "react";

const tools = [
  { id: "pdf-to-word", label: "PDF → Word", icon: "📄", from: "PDF", to: "DOCX", desc: "Convert PDF to editable Word document", premium: false },
  { id: "pdf-to-jpg", label: "PDF → JPG", icon: "🖼️", from: "PDF", to: "JPG", desc: "Extract pages as high-quality images", premium: false },
  { id: "pdf-to-ppt", label: "PDF → PPT", icon: "📊", from: "PDF", to: "PPTX", desc: "Turn your PDF into a presentation", premium: false },
  { id: "pdf-to-excel", label: "PDF → Excel", icon: "📈", from: "PDF", to: "XLSX", desc: "Extract tables into spreadsheets", premium: false },
  { id: "word-to-pdf", label: "Word → PDF", icon: "📝", from: "DOCX", to: "PDF", desc: "Convert Word docs to PDF instantly", premium: false },
  { id: "jpg-to-pdf", label: "JPG → PDF", icon: "🗂️", from: "JPG", to: "PDF", desc: "Merge images into a single PDF", premium: false },
  { id: "compress-pdf", label: "Compress PDF", icon: "🗜️", from: "PDF", to: "PDF", desc: "Reduce PDF file size dramatically", premium: false },
  { id: "merge-pdf", label: "Merge PDFs", icon: "🔗", from: "PDFs", to: "PDF", desc: "Combine multiple PDFs into one", premium: false },
  { id: "split-pdf", label: "Split PDF", icon: "✂️", from: "PDF", to: "PDFs", desc: "Split PDF into separate pages", premium: true },
  { id: "rotate-pdf", label: "Rotate PDF", icon: "🔄", from: "PDF", to: "PDF", desc: "Rotate pages to correct orientation", premium: true },
  { id: "watermark-pdf", label: "Watermark PDF", icon: "💧", from: "PDF", to: "PDF", desc: "Add custom watermarks to PDFs", premium: true },
  { id: "protect-pdf", label: "Protect PDF", icon: "🔒", from: "PDF", to: "PDF", desc: "Password-protect your documents", premium: true },
  { id: "unlock-pdf", label: "Unlock PDF", icon: "🔓", from: "PDF", to: "PDF", desc: "Remove PDF password protection", premium: true },
  { id: "sign-pdf", label: "Sign PDF", icon: "✍️", from: "PDF", to: "PDF", desc: "Add digital signatures to PDFs", premium: true },
  { id: "ocr-pdf", label: "OCR PDF", icon: "🔍", from: "PDF", to: "PDF", desc: "Make scanned PDFs searchable", premium: true },
  { id: "edit-pdf", label: "Edit PDF", icon: "🖊️", from: "PDF", to: "PDF", desc: "Edit text and images in PDFs", premium: true },
  { id: "pdf-to-html", label: "PDF → HTML", icon: "🌐", from: "PDF", to: "HTML", desc: "Convert PDFs to web-ready HTML", premium: true },
  { id: "pdf-to-txt", label: "PDF → TXT", icon: "📃", from: "PDF", to: "TXT", desc: "Extract plain text from PDFs", premium: false },
];

const STAGES = { IDLE: "idle", UPLOADING: "uploading", CONVERTING: "converting", DONE: "done", ERROR: "error" };

function UploadZone({ tool, onConvert }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(STAGES.IDLE);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const simulate = () => {
    if (!file) return;
    setStage(STAGES.UPLOADING);
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        setStage(STAGES.CONVERTING);
        setTimeout(() => setStage(STAGES.DONE), 1800);
      } else {
        setProgress(Math.min(p, 99));
      }
    }, 180);
  };

  const reset = () => { setFile(null); setStage(STAGES.IDLE); setProgress(0); };

  return (
    <div style={{ fontFamily: "'Syne', sans-serif" }}>
      {stage === STAGES.IDLE && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? "#FF4D00" : "#333"}`,
            borderRadius: 16,
            padding: "56px 32px",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver ? "rgba(255,77,0,0.06)" : "rgba(255,255,255,0.02)",
            transition: "all 0.2s",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>{tool.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
            Drop your {tool.from} here
          </div>
          <div style={{ fontSize: 14, color: "#888" }}>or click to browse files</div>
          <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
        </div>
      )}

      {file && stage === STAGES.IDLE && (
        <div style={{ marginTop: 16, background: "rgba(255,77,0,0.08)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{file.name}</div>
            <div style={{ color: "#888", fontSize: 13 }}>{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <button onClick={simulate} style={{ background: "#FF4D00", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            Convert →
          </button>
        </div>
      )}

      {(stage === STAGES.UPLOADING || stage === STAGES.CONVERTING) && (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <div style={{ fontSize: 15, color: "#aaa", marginBottom: 16 }}>
            {stage === STAGES.UPLOADING ? "Uploading..." : "Converting your file..."}
          </div>
          <div style={{ background: "#1a1a1a", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#FF4D00,#FF8A50)", borderRadius: 99, transition: "width 0.2s" }} />
          </div>
          <div style={{ color: "#FF4D00", fontWeight: 700, marginTop: 10, fontSize: 14 }}>{Math.round(progress)}%</div>
        </div>
      )}

      {stage === STAGES.DONE && (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Conversion Complete!</div>
          <div style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Your {tool.to} file is ready</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: "#FF4D00", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              ⬇ Download {tool.to}
            </button>
            <button onClick={reset} style={{ background: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: 8, padding: "12px 20px", cursor: "pointer", fontSize: 14 }}>
              Convert another
            </button>
          </div>
          {/* AdSense Placeholder */}
          <div style={{ marginTop: 24, border: "1px dashed #333", borderRadius: 10, padding: "18px", color: "#555", fontSize: 12 }}>
            📢 AdSense Ad Unit — 728×90 Leaderboard
          </div>
        </div>
      )}
    </div>
  );
}

function PremiumModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 20, padding: 40, maxWidth: 420, width: "100%", textAlign: "center", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>✕</button>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Go Premium</div>
        <div style={{ color: "#888", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
          Unlock all tools — OCR, editing, signing, watermarks, and more. No file size limits. Priority processing.
        </div>
        {[["Free", "7 tools, 10MB limit, ads", false], ["Pro — ₹299/mo", "All 18 tools, 100MB, no ads", true], ["Team — ₹799/mo", "5 users, API access, priority", false]].map(([plan, desc, highlight]) => (
          <div key={plan} style={{ background: highlight ? "rgba(255,77,0,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${highlight ? "#FF4D00" : "#222"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontWeight: 700, color: highlight ? "#FF4D00" : "#fff", fontSize: 16 }}>{plan}</div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>{desc}</div>
          </div>
        ))}
        <button style={{ marginTop: 8, background: "#FF4D00", color: "#fff", border: "none", borderRadius: 10, padding: "14px 36px", fontWeight: 800, fontSize: 16, cursor: "pointer", width: "100%" }}>
          Start Free Trial →
        </button>
      </div>
    </div>
  );
}

export default function PDFForge() {
  const [activeTool, setActiveTool] = useState(null);
  const [showPremium, setShowPremium] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const freeTools = tools.filter(t => !t.premium);
  const premiumTools = tools.filter(t => t.premium);

  const handleToolClick = (tool) => {
    if (tool.premium) { setShowPremium(true); return; }
    setActiveTool(tool);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .tool-card:hover { transform: translateY(-4px); border-color: #FF4D00 !important; }
        .tool-card { transition: transform 0.2s, border-color 0.2s; }
        .nav-link:hover { color: #FF4D00 !important; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .hero-icon { animation: float 3s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .ad-slot { background: linear-gradient(135deg, #111 0%, #181818 100%); border: 1px dashed #2a2a2a; border-radius: 10px; display:flex; align-items:center; justify-content:center; color:#444; font-size:13px; font-family:'JetBrains Mono',monospace; }
      `}</style>

      {/* Google Fonts link tag emulated in style above */}

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>PDF<span style={{ color: "#FF4D00" }}>forge</span></span>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 14, fontWeight: 600 }}>
          {["Tools", "Pricing", "About"].map(l => (
            <span key={l} className="nav-link" style={{ cursor: "pointer", color: "#aaa", transition: "color 0.2s" }}>{l}</span>
          ))}
        </div>
        <button onClick={() => setShowPremium(true)} style={{ background: "#FF4D00", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Go Pro ⚡
        </button>
      </nav>

      {/* TOP AD SLOT */}
      <div style={{ padding: "12px 24px 0" }}>
        <div className="ad-slot" style={{ height: 80 }}>📢 AdSense — 728×90 Leaderboard Banner</div>
      </div>

      {/* HERO */}
      {!activeTool && (
        <div className="fade-up" style={{ textAlign: "center", padding: "72px 24px 40px" }}>
          <div className="hero-icon" style={{ fontSize: 64, marginBottom: 20 }}>📑</div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 16 }}>
            Every PDF tool<br /><span style={{ color: "#FF4D00" }}>you'll ever need.</span>
          </h1>
          <p style={{ color: "#888", fontSize: 18, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Convert, compress, merge, split, sign, protect — all in one blazing-fast tool. Free forever, with Pro for power users.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("tools-grid").scrollIntoView({ behavior: "smooth" })} style={{ background: "#FF4D00", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
              Start Converting →
            </button>
            <button onClick={() => setShowPremium(true)} style={{ background: "transparent", color: "#fff", border: "1px solid #333", borderRadius: 10, padding: "14px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
              See Pro Plans ⚡
            </button>
          </div>
          {/* Stats bar */}
          <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
            {[["50M+", "Files Converted"], ["18", "Free Tools"], ["100%", "Private & Secure"]].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#FF4D00" }}>{val}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE TOOL CONVERTER */}
      {activeTool && (
        <div className="fade-up" style={{ maxWidth: 600, margin: "40px auto", padding: "0 24px" }}>
          <button onClick={() => setActiveTool(null)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back to all tools
          </button>
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 20, padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{activeTool.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>{activeTool.label}</div>
                <div style={{ color: "#888", fontSize: 14 }}>{activeTool.desc}</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #1e1e1e", marginTop: 20, paddingTop: 20 }}>
              <UploadZone tool={activeTool} />
            </div>
          </div>
          {/* Sidebar ad */}
          <div className="ad-slot" style={{ height: 120, marginTop: 16 }}>📢 AdSense — 300×250 Rectangle</div>
        </div>
      )}

      {/* TOOLS GRID */}
      <div id="tools-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Free Tools */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontWeight: 800, fontSize: 22 }}>Free Tools</span>
            <span style={{ background: "rgba(255,77,0,0.15)", color: "#FF4D00", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>NO SIGN-UP</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {freeTools.map(tool => (
              <div key={tool.id} className="tool-card" onClick={() => handleToolClick(tool)}
                style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "20px", cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{tool.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tool.label}</div>
                <div style={{ color: "#666", fontSize: 13, lineHeight: 1.4 }}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid-page ad */}
        <div className="ad-slot" style={{ height: 100, marginBottom: 48 }}>📢 AdSense — 970×90 Large Leaderboard</div>

        {/* Premium Tools */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontWeight: 800, fontSize: 22 }}>Premium Tools</span>
            <span style={{ background: "rgba(255,200,0,0.12)", color: "#FFD700", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>⚡ PRO</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {premiumTools.map(tool => (
              <div key={tool.id} className="tool-card" onClick={() => handleToolClick(tool)}
                style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "20px", cursor: "pointer", position: "relative", opacity: 0.85 }}>
                <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,200,0,0.15)", color: "#FFD700", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>PRO</div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{tool.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tool.label}</div>
                <div style={{ color: "#666", fontSize: 13, lineHeight: 1.4 }}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: "-1px" }}>Simple Pricing</h2>
          <p style={{ color: "#666", marginBottom: 40 }}>Start free. Upgrade when you need more.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { name: "Free", price: "₹0", period: "forever", features: ["7 core tools", "10MB file limit", "Ad-supported", "Basic conversion"], cta: "Get Started", highlight: false },
              { name: "Pro", price: "₹299", period: "/month", features: ["All 18 tools", "100MB file limit", "No ads", "Priority queue", "Batch convert"], cta: "Start Free Trial", highlight: true },
              { name: "Team", price: "₹799", period: "/month", features: ["Everything in Pro", "5 team members", "API access", "Custom branding", "Priority support"], cta: "Try Team", highlight: false },
            ].map(plan => (
              <div key={plan.name} style={{ background: plan.highlight ? "rgba(255,77,0,0.08)" : "#111", border: `1px solid ${plan.highlight ? "#FF4D00" : "#1e1e1e"}`, borderRadius: 20, padding: "32px 24px" }}>
                {plan.highlight && <div style={{ color: "#FF4D00", fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Most Popular</div>}
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: plan.highlight ? "#FF4D00" : "#fff" }}>{plan.price}<span style={{ fontSize: 14, color: "#666", fontWeight: 400 }}>{plan.period}</span></div>
                <div style={{ margin: "20px 0", borderTop: "1px solid #1e1e1e", paddingTop: 20 }}>
                  {plan.features.map(f => <div key={f} style={{ color: "#aaa", fontSize: 14, marginBottom: 8, textAlign: "left" }}>✓ {f}</div>)}
                </div>
                <button onClick={() => setShowPremium(true)} style={{ width: "100%", background: plan.highlight ? "#FF4D00" : "transparent", color: plan.highlight ? "#fff" : "#aaa", border: `1px solid ${plan.highlight ? "#FF4D00" : "#333"}`, borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM AD */}
      <div style={{ padding: "16px 24px" }}>
        <div className="ad-slot" style={{ height: 80 }}>📢 AdSense — 728×90 Footer Leaderboard</div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#080808", borderTop: "1px solid #1a1a1a", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>PDF<span style={{ color: "#FF4D00" }}>forge</span></div>
        <div style={{ color: "#444", fontSize: 13, marginBottom: 12 }}>Fast, secure, free PDF tools for everyone.</div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", fontSize: 13, color: "#555" }}>
          {["Privacy Policy", "Terms of Service", "Contact", "Blog"].map(l => <span key={l} style={{ cursor: "pointer" }}>{l}</span>)}
        </div>
        <div style={{ color: "#333", fontSize: 12, marginTop: 16 }}>© 2025 PDFforge. All rights reserved.</div>
      </footer>

      {/* PREMIUM MODAL */}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
