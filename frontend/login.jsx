/* global React, Icons */
var { useState, useEffect } = React;

function Login({ onLogin }) {
  const [id, setId] = useState("admin.siwon");
  const [pw, setPw] = useState("••••••••••");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e && e.preventDefault();
    setLoading(true);
    setTimeout(() => onLogin(), 1000);
  };

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 30% 20%, #1a1f4a 0%, #0a0e1f 55%, #050810 100%)",
      overflow: "hidden",
    }}>
      {/* Background grid + glow */}
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7 }}>
        <defs>
          <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e2a52" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="glow1" cx="0.3" cy="0.2" r="0.5">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="0.8" cy="0.85" r="0.4">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#g)" />
        <rect width="1920" height="1080" fill="url(#glow1)" />
        <rect width="1920" height="1080" fill="url(#glow2)" />

        {/* orbit rings */}
        <g transform="translate(480,540)" opacity="0.4">
          <circle r="320" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 8" />
          <circle r="260" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 6" />
          <circle r="180" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="1 5" />
        </g>

        {/* connection lines */}
        <g stroke="#4f46e5" strokeWidth="0.8" opacity="0.4" fill="none">
          <path d="M 200 200 L 460 440 L 700 300 L 900 600 L 1200 400 L 1500 700" />
          <path d="M 100 800 L 380 740 L 680 820 L 900 660 L 1180 780" />
        </g>

        {/* nodes */}
        <g fill="#4f46e5">
          {[[200,200],[460,440],[700,300],[900,600],[1200,400],[1500,700],[100,800],[380,740],[680,820],[1180,780]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#7c74ff" />
              <circle cx={x} cy={y} r="6" fill="none" stroke="#7c74ff" strokeWidth="1" opacity="0.5">
                <animate attributeName="r" values="3;12;3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>
      </svg>

      {/* Scan line */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: 100,
          background: "linear-gradient(90deg, transparent, rgba(124,116,255,0.12), transparent)",
          animation: "scan-line 8s linear infinite",
        }} />
      </div>

      {/* Top brand strip */}
      <div style={{
        position: "absolute", left: 64, top: 48, right: 64,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "rgba(255,255,255,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "grid", placeItems: "center",
            boxShadow: "0 0 40px -5px rgba(79,70,229,0.6)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="#fff" stroke="none" />
              <path d="M5 12a7 7 0 0 1 7-7" />
              <path d="M19 12a7 7 0 0 1-7 7" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>매설배관 AI 통합관제 시스템</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>PIPELINE CP MONITORING · v3.0.1</div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse-dot 1.2s infinite" }} />
          55 NODES · ONLINE
        </div>
      </div>

      {/* Login card */}
      <div style={{
        position: "absolute", right: 180, top: "50%", transform: "translateY(-50%)",
        width: 440,
        background: "rgba(18, 24, 48, 0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(124,116,255,0.25)",
        borderRadius: 20,
        padding: 40,
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 60px -20px rgba(79,70,229,0.3)",
      }}>
        <div style={{ marginBottom: 28 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#7c74ff", fontWeight: 700, marginBottom: 8 }}>OPERATOR LOGIN</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            통합관제실<br />운영자 로그인
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
            등록된 운영자 계정으로 접속해 주세요.
          </div>
        </div>

        <form onSubmit={submit}>
          <Field icon={<Icons.user size={14} />} label="운영자 ID">
            <input value={id} onChange={e => setId(e.target.value)}
                   style={inputStyle} placeholder="admin.id" />
          </Field>
          <Field icon={<Icons.lock size={14} />} label="비밀번호">
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
                   style={inputStyle} placeholder="••••••••" />
          </Field>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              <div onClick={() => setRemember(!remember)} style={{
                width: 16, height: 16, borderRadius: 4,
                background: remember ? "#7c74ff" : "transparent",
                border: `1px solid ${remember ? "#7c74ff" : "rgba(255,255,255,0.3)"}`,
                display: "grid", placeItems: "center",
              }}>
                {remember && <Icons.check size={10} color="#fff" />}
              </div>
              로그인 상태 유지
            </label>
            <a style={{ fontSize: 12, color: "#7c74ff", cursor: "pointer" }}>비밀번호 찾기</a>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px", borderRadius: 12,
            background: loading ? "rgba(79,70,229,0.5)" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "#fff", fontSize: 14, fontWeight: 700,
            boxShadow: "0 10px 30px -8px rgba(79,70,229,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {loading ? (
              <>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  animation: "spin 0.7s linear infinite",
                }} />
                인증 중...
              </>
            ) : (
              <>로그인 <Icons.chevron_right size={16} /></>
            )}
          </button>
        </form>

        <div style={{
          marginTop: 24, paddingTop: 20,
          borderTop: "1px dashed rgba(255,255,255,0.1)",
          display: "flex", justifyContent: "space-between",
          fontSize: 10, color: "rgba(255,255,255,0.4)",
        }}>
          <span className="mono">REGION: KR-SEOUL-01</span>
          <span className="mono">BUILD: 2026.03.26</span>
        </div>
      </div>

      {/* Left side stats */}
      <div style={{
        position: "absolute", left: 180, top: "50%", transform: "translateY(-50%)",
        color: "#fff", maxWidth: 520,
      }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "#7c74ff", marginBottom: 16, fontWeight: 700 }}>
          AI PIPELINE MONITORING PLATFORM
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
          매설배관 방식전위<br />
          <span style={{ background: "linear-gradient(135deg, #7c74ff, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            원격감시 시스템
          </span>
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 32 }}>
          전국 55개 감시 모듈의 6종 센서 데이터를<br />
          LSTM 오토인코더가 24시간 실시간으로 분석합니다.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "감시 노드", value: "55", icon: <Icons.cpu size={14} /> },
            { label: "센서 채널", value: "330", icon: <Icons.activity size={14} /> },
            { label: "가동률", value: "99.9%", icon: <Icons.zap size={14} /> },
          ].map(s => (
            <div key={s.label} style={{
              padding: "14px 18px", borderRadius: 12,
              background: "rgba(124,116,255,0.08)",
              border: "1px solid rgba(124,116,255,0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7c74ff", marginBottom: 4 }}>
                {s.icon}
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", fontWeight: 700 }}>{s.label}</span>
              </div>
              <div className="num" style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", left: 64, right: 64, bottom: 36,
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "rgba(255,255,255,0.35)",
      }}>
        <span className="mono" style={{ letterSpacing: "0.05em" }}>© 2026 매설배관 AI 통합관제 · v3.0.1 (LSTM-Autoencoder)</span>
        <span className="mono" style={{ letterSpacing: "0.05em" }}>ISO/IEC 27001 · K-ISMS</span>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1, background: "transparent",
  border: "none", outline: "none",
  color: "#fff", fontSize: 14, fontWeight: 500,
  padding: "12px 0",
};

function Field({ icon, label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 11, letterSpacing: "0.05em",
        color: "rgba(255,255,255,0.55)", fontWeight: 600,
        marginBottom: 6,
      }}>
        <span style={{ color: "#7c74ff" }}>{icon}</span>
        {label}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "0 14px", borderRadius: 10,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
        transition: "border-color 160ms",
      }}>
        {children}
      </div>
    </div>
  );
}

window.Login = Login;
