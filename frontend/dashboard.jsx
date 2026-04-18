/* global React, Icons, MapPanel */
var { useState, useEffect, useRef, useMemo } = React;

var statusChip = (status) => {
  const map = {
    normal:  { ko: "정상", fg: "#047857", bg: "rgba(16,185,129,0.14)", bd: "rgba(16,185,129,0.3)" },
    anomaly: { ko: "이상", fg: "#b91c1c", bg: "rgba(239,68,68,0.12)",   bd: "rgba(239,68,68,0.3)" },
    warn:    { ko: "관찰", fg: "#b45309", bg: "rgba(245,158,11,0.14)",  bd: "rgba(245,158,11,0.3)" },
    offline: { ko: "장애", fg: "#475569", bg: "rgba(100,116,139,0.14)", bd: "rgba(100,116,139,0.3)" },
  };
  return map[status] || map.normal;
};

function Kpi({ label, value, accent, icon, delta, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "relative", flex: 1, minWidth: 0, height: 112, textAlign: "left",
      background: "var(--bg-elev)", borderRadius: 16,
      border: `1px solid ${active ? accent : "var(--line)"}`,
      padding: "18px 20px",
      boxShadow: active ? `0 0 0 3px ${accent}22, var(--shadow-card)` : "var(--shadow-card)",
      cursor: "pointer", transition: "all 180ms",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: accent,
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.02em" }}>{label}</div>
        <div style={{ color: accent, opacity: 0.9 }}>{icon}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div className="num" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1, color: "var(--ink)" }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 500 }}>대</div>
        {delta && (
          <div className="mono" style={{
            marginLeft: "auto", fontSize: 11, fontWeight: 700,
            color: delta.startsWith("+") ? "var(--err)" : "var(--ok)",
          }}>{delta}</div>
        )}
      </div>
      {/* sparkline */}
      <svg viewBox="0 0 200 30" style={{ position: "absolute", right: 14, bottom: 10, width: 130, height: 26, opacity: 0.5 }}>
        <polyline fill="none" stroke={accent} strokeWidth="1.5"
                  points="0,20 20,18 40,22 60,12 80,16 100,8 120,14 140,6 160,10 180,4 200,12" />
      </svg>
    </button>
  );
}

function KPIRow({ active, setActive, counts }) {
  const items = [
    { k: "all",      label: "총 장비",     value: counts.all,      accent: "var(--brand)", icon: <Icons.box size={18} /> },
    { k: "normal",   label: "정상",        value: counts.normal,   accent: "var(--ok)",    icon: <Icons.check size={18} /> },
    { k: "anomaly",  label: "이상 의심",   value: counts.anomaly,  accent: "var(--err)",   icon: <Icons.alert size={18} />, delta: "+2" },
    { k: "warn",     label: "관찰 필요",   value: counts.warn,     accent: "var(--warn)",  icon: <Icons.eye size={18} /> },
    { k: "offline",  label: "통신 장애",   value: counts.offline,  accent: "var(--ink-3)", icon: <Icons.wifi_off size={18} /> },
  ];
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {items.map(i => (
        <Kpi key={i.k} {...i} active={active === i.k} onClick={() => setActive(i.k === active ? null : i.k)} />
      ))}
    </div>
  );
}

function PanelHeader({ children, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px", borderBottom: "1px solid var(--line-soft)",
    }}>
      {children}
      {right}
    </div>
  );
}

function Panel({ children, style, className }) {
  return (
    <div className={className} style={{
      background: "var(--bg-elev)", borderRadius: 16,
      border: "1px solid var(--line)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

function AnomalyCard({ item, onClick, kind }) {
  const color = kind === "warn" ? "var(--warn)" : "var(--err)";
  const label = kind === "warn" ? "확인" : "분석";
  return (
    <div onClick={() => onClick(item)} role="button" tabIndex={0} style={{
      display: "block", width: "100%", textAlign: "left",
      padding: "10px 12px",
      background: "var(--bg-sunk)", border: "1px solid var(--line-soft)",
      borderRadius: 10, marginBottom: 6,
      transition: "all 160ms", cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>{item.node}</span>
            <span style={{
              fontSize: 9, color: "var(--ink-4)", fontWeight: 600,
              padding: "1px 5px", borderRadius: 3,
              background: "var(--bg-elev)", border: "1px solid var(--line)",
              flexShrink: 0,
            }}>{item.zone}</span>
          </div>
          <div style={{ fontSize: 11, color, marginTop: 3, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-4)", letterSpacing: "0.05em" }}>MSE</div>
          <div className="mono num" style={{ fontSize: 14, fontWeight: 700, color, lineHeight: 1 }}>{item.mse.toFixed(3)}</div>
        </div>
      </div>
      {item.contribution && item.contribution.length > 0 && (
        <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
            {item.contribution.map((c, i) => (
              <span key={i} style={{
                fontSize: 9, fontWeight: 600,
                padding: "2px 6px", borderRadius: 4,
                background: i === 0 ? `${color.replace("var(--err)", "rgba(239,68,68,0.15)").replace("var(--warn)", "rgba(245,158,11,0.15)")}` : "var(--bg-elev)",
                color: i === 0 ? color : "var(--ink-3)",
                border: `1px solid ${i === 0 ? color : "var(--line)"}`,
                whiteSpace: "nowrap",
              }}>{c.sensor} {c.pct}%</span>
            ))}
          </div>
          <button style={{
            padding: "4px 10px", background: color, color: "#fff", borderRadius: 6,
            fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>{label}</button>
        </div>
      )}
    </div>
  );
}

function AIPanels({ onAnalyze, anomalies, watch }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel style={{ flex: 1 }}>
        <PanelHeader
          right={<span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 10px",
            background: "rgba(239,68,68,0.12)", color: "var(--err)",
            borderRadius: 999,
          }}>건수 {anomalies.length}</span>}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.alert size={16} color="var(--err)" />
            <div style={{ fontSize: 14, fontWeight: 700 }}>AI 이상 의심 리스트</div>
          </div>
        </PanelHeader>
        <div className="scroll" style={{ padding: 12, maxHeight: 180, overflowY: "auto" }}>
          {anomalies.slice(0, 4).map((a) => (
            <AnomalyCard key={a.node} item={a} kind="anomaly" onClick={onAnalyze} />
          ))}
        </div>
      </Panel>
      <Panel style={{ flex: 1 }}>
        <PanelHeader
          right={<span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 10px",
            background: "rgba(245,158,11,0.12)", color: "var(--warn)",
            borderRadius: 999,
          }}>건수 {watch.length}</span>}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.eye size={16} color="var(--warn)" />
            <div style={{ fontSize: 14, fontWeight: 700 }}>AI 관찰 필요 리스트</div>
          </div>
        </PanelHeader>
        <div className="scroll" style={{ padding: 12, maxHeight: 180, overflowY: "auto" }}>
          {watch.map((a) => (
            <AnomalyCard key={a.node} item={a} kind="warn" onClick={onAnalyze} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AIAdvicePanel({ insights }) {
  const iconFor = (kind) => ({
    alert: <Icons.alert size={16} />,
    trend: <Icons.trend size={16} />,
    sparkle: <Icons.sparkle size={16} />,
  }[kind] || <Icons.sparkle size={16} />);

  return (
    <Panel style={{
      height: "100%", display: "flex", flexDirection: "column",
      border: "1px solid rgba(79,70,229,0.25)",
      boxShadow: "0 0 40px -10px rgba(79,70,229,0.25), var(--shadow-card)",
    }}>
      <div style={{
        padding: "16px 20px",
        background: "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.04))",
        borderBottom: "1px solid var(--line-soft)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, var(--brand), #a855f7)",
            display: "grid", placeItems: "center", color: "#fff",
            boxShadow: "0 6px 14px -4px rgba(79,70,229,0.5)",
          }}>
            <Icons.sparkle size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>AI 권고 및 분석 조언</div>
            <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 1 }}>Generated · 14:41:58</div>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 999,
          background: "rgba(79,70,229,0.1)", color: "var(--brand)",
          fontSize: 10, fontWeight: 700,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "var(--brand)",
            animation: "pulse-dot 1.2s infinite",
          }} />
          분석 엔진 가동중
        </div>
      </div>
      <div className="scroll" style={{ padding: 16, overflowY: "auto", flex: 1 }}>
        {insights.map((it, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "12px 0",
            borderBottom: i < insights.length - 1 ? "1px dashed var(--line-soft)" : "none",
          }}>
            <div style={{
              flexShrink: 0,
              width: 32, height: 32, borderRadius: 10,
              background: it.kind === "alert" ? "rgba(239,68,68,0.1)" :
                          it.kind === "trend" ? "rgba(16,185,129,0.1)" :
                                                "rgba(79,70,229,0.1)",
              color: it.kind === "alert" ? "var(--err)" :
                     it.kind === "trend" ? "var(--ok)" :
                                           "var(--brand)",
              display: "grid", placeItems: "center",
            }}>
              {iconFor(it.icon)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>{it.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MapPanelWrap({ markers, onMarker, activeMarker, mapStyle, theme, setMapStyle }) {
  return (
    <Panel style={{ position: "relative", height: "100%" }}>
      <MapPanel markers={markers} activeId={activeMarker && activeMarker.id} onMarker={onMarker}
                mapStyle={mapStyle} theme={theme} />
      {/* Legend */}
      <div style={{
        position: "absolute", left: 16, top: 16,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        border: "1px solid var(--line-soft)", borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px -10px rgba(0,0,0,0.2)",
        color: "#0f172a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ok)", animation: "pulse-dot 1.2s infinite" }} />
          <div style={{ fontSize: 12, fontWeight: 800 }}>GIS 위치관제 <span style={{ color: "#64748b", fontWeight: 500 }}>(Live)</span></div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#475569" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand)" }} />정상
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--err)" }} />이상
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warn)" }} />관찰
          </span>
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{
        position: "absolute", left: 16, top: 90,
        display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        border: "1px solid var(--line-soft)", borderRadius: 10,
        boxShadow: "0 8px 24px -10px rgba(0,0,0,0.2)",
        overflow: "hidden",
        color: "#0f172a",
      }}>
        <button style={mapBtn}><Icons.plus size={14} /></button>
        <div style={{ height: 1, background: "var(--line-soft)" }} />
        <button style={mapBtn}><Icons.minus size={14} /></button>
        <div style={{ height: 1, background: "var(--line-soft)" }} />
        <button style={mapBtn}><Icons.crosshair size={14} /></button>
      </div>

      {/* Map style switcher */}
      <div style={{
        position: "absolute", right: 16, top: 16,
        display: "flex", gap: 2,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        border: "1px solid var(--line-soft)", borderRadius: 10,
        padding: 2,
        boxShadow: "0 8px 24px -10px rgba(0,0,0,0.2)",
        color: "#0f172a",
      }}>
        {[
          { k: "light", icon: <Icons.sun size={14} />, label: "Light" },
          { k: "dark", icon: <Icons.moon size={14} />, label: "Dark" },
          { k: "satellite", icon: <Icons.satellite size={14} />, label: "Sat" },
        ].map(m => (
          <button key={m.k} onClick={() => setMapStyle(m.k)} style={{
            padding: "6px 10px", borderRadius: 8,
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 700,
            background: mapStyle === m.k ? "var(--brand-wash)" : "transparent",
            color: mapStyle === m.k ? "var(--brand)" : "#64748b",
          }}>{m.icon}{m.label}</button>
        ))}
      </div>

      {/* Marker popup */}
      {activeMarker && activeMarker.kind === "single" && (
        <MarkerPopup m={activeMarker} onClose={() => onMarker(null)} />
      )}
    </Panel>
  );
}

const mapBtn = {
  width: 32, height: 32, display: "grid", placeItems: "center",
  color: "#334155",
};

function MarkerPopup({ m, onClose }) {
  const color = m.status === "anomaly" ? "var(--err)" : "var(--warn)";
  return (
    <div style={{
      position: "absolute",
      left: `${m.x * 100}%`, top: `${m.y * 100}%`,
      transform: "translate(-50%, calc(-100% - 50px))",
      background: "#fff",
      border: "1px solid var(--line-soft)",
      borderRadius: 12,
      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.25)",
      padding: 14, minWidth: 240,
      animation: "slide-in-up 220ms ease",
      zIndex: 10,
      color: "#0f172a",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
        <div>
          <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{m.node}</div>
          <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{m.label}</div>
        </div>
        <button onClick={onClose} style={{ color: "#64748b" }}><Icons.close size={14} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
        <Metric label="MSE" value={m.mse.toFixed(3)} color={color} />
        <Metric label="구역" value={m.zone} />
        <Metric label="상태" value={m.status === "anomaly" ? "이상" : "관찰"} color={color} />
        <Metric label="좌표" value="37.56 127.08" mono />
      </div>
      <div style={{
        marginTop: 10, padding: "8px 10px", borderRadius: 8,
        background: "rgba(79,70,229,0.06)", color: "#4f46e5",
        fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
      }}>
        <Icons.sparkle size={12} />
        AI 이상 스코어 적용 · 실시간 분석 중
      </div>
      <div style={{
        position: "absolute", left: "50%", bottom: -6,
        transform: "translateX(-50%) rotate(45deg)",
        width: 12, height: 12, background: "#fff",
        borderRight: "1px solid var(--line-soft)",
        borderBottom: "1px solid var(--line-soft)",
      }} />
    </div>
  );
}

function Metric({ label, value, color, mono }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{label}</div>
      <div className={mono ? "mono" : ""} style={{ fontSize: 12, fontWeight: 700, color: color || "#0f172a" }}>{value}</div>
    </div>
  );
}

function MiniTable({ data, onRowClick }) {
  return (
    <div className="scroll" style={{ overflow: "auto", height: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ position: "sticky", top: 0, background: "var(--bg-elev)", zIndex: 1 }}>
            {["시설명", "장비명", "설치위치", "상태", "방식전위", "AC유입", "희생전류", "온도", "습도", "통신", "갱신"].map((h, i) => (
              <th key={h} style={{
                textAlign: i <= 2 || i === 10 ? "left" : "right",
                padding: "12px 12px",
                fontWeight: 700, fontSize: 11, color: "var(--ink-3)",
                borderBottom: "1px solid var(--line)",
                background: "var(--bg-elev)",
                whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 6).map((r, i) => {
            const c = statusChip(r.status);
            return (
              <tr key={r.id} onClick={() => onRowClick && onRowClick(r)} style={{
                borderBottom: "1px solid var(--line-soft)",
                cursor: "pointer",
              }}>
                <td className="mono" style={{ padding: "12px 12px", fontWeight: 700 }}>{r.facilityId}</td>
                <td className="mono" style={{ padding: "12px 12px", color: "var(--ink-2)" }}>{r.deviceId}</td>
                <td style={{ padding: "12px 12px", color: "var(--ink-2)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.location}</td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 6,
                    fontSize: 11, fontWeight: 700,
                    background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
                  }}>{c.ko}</span>
                </td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: r.status === "anomaly" ? "var(--err)" : "var(--ink)", fontWeight: r.status === "anomaly" ? 700 : 500 }}>{r.volt}<span style={{ color: "var(--ink-4)", fontSize: 10, marginLeft: 2 }}>mV</span></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: "var(--ink-2)" }}>{r.ac.toLocaleString()}<span style={{ color: "var(--ink-4)", fontSize: 10, marginLeft: 2 }}>mV</span></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: r.sacrificial < 1 ? "var(--warn)" : "var(--ink-2)" }}>{r.sacrificial}<span style={{ color: "var(--ink-4)", fontSize: 10, marginLeft: 2 }}>mA</span></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: "var(--ink-2)" }}>{r.temp}<span style={{ color: "var(--ink-4)", fontSize: 10, marginLeft: 2 }}>°C</span></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: "var(--ink-2)" }}>{r.hum}<span style={{ color: "var(--ink-4)", fontSize: 10, marginLeft: 2 }}>%</span></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "center", color: r.commOk ? (r.commDbm < -75 ? "var(--warn)" : "var(--ok)") : "var(--err)", fontWeight: 600 }}>{r.commDbm}<span style={{ color: "var(--ink-4)", fontSize: 10, marginLeft: 2 }}>dBm</span></td>
                <td className="mono" style={{ padding: "12px 12px", color: "var(--ink-3)", whiteSpace: "nowrap", fontSize: 11 }}>{r.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TableSummary({ data, onRowClick }) {
  const [query, setQuery] = useState("");
  const filtered = data.filter(r =>
    !query ||
    r.facilityId.toLowerCase().includes(query.toLowerCase()) ||
    r.deviceId.toLowerCase().includes(query.toLowerCase()) ||
    r.location.includes(query)
  );
  return (
    <Panel style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <PanelHeader
        right={
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 10,
              background: "var(--bg-sunk)", border: "1px solid var(--line)",
              width: 240,
            }}>
              <Icons.search size={13} color="var(--ink-4)" />
              <input
                placeholder="장비 검색..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 12,
                }}
              />
            </div>
            <button style={{
              padding: "6px 14px", borderRadius: 10,
              background: "var(--bg-sunk)", border: "1px solid var(--line)",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, color: "var(--ink-2)",
            }}>
              <Icons.refresh size={12} />새로고침
            </button>
          </div>
        }>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 4, height: 18, background: "var(--brand)", borderRadius: 2 }} />
          <div style={{ fontSize: 14, fontWeight: 700 }}>전체 장비 현황 요약</div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px",
            background: "var(--brand-wash)", color: "var(--brand)", borderRadius: 999,
          }}>{filtered.length}개</span>
        </div>
      </PanelHeader>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <MiniTable data={filtered} onRowClick={onRowClick} />
      </div>
    </Panel>
  );
}

function LogLine({ line }) {
  const colors = {
    ok:    "var(--ok)",
    data:  "var(--ink-2)",
    alert: "var(--err)",
    ai:    "var(--brand)",
    auth:  "var(--ink-3)",
    warn:  "var(--warn)",
  };
  const bg = line.kind === "alert" ? "rgba(239,68,68,0.08)" :
             line.kind === "warn"  ? "rgba(245,158,11,0.08)" : "transparent";
  const border = line.kind === "alert" ? "1px solid rgba(239,68,68,0.3)" :
                 line.kind === "warn"  ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent";
  return (
    <div className="mono" style={{
      padding: "4px 10px", borderRadius: 6, marginBottom: 3,
      fontSize: 11, display: "flex", gap: 10, alignItems: "center",
      background: bg, border: border,
      animation: "slide-in-up 220ms ease",
    }}>
      <span style={{ color: colors[line.kind] || "var(--ink-3)", fontWeight: 700, flexShrink: 0 }}>
        [{line.time}]
      </span>
      <span style={{
        flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        color: line.kind === "alert" || line.kind === "warn" ? colors[line.kind] : "var(--ink-2)",
        fontWeight: line.kind === "alert" ? 700 : 400,
      }}>{line.text}</span>
      {line.tail && (
        <span style={{ color: colors[line.kind] || "var(--ok)", fontWeight: 700, flexShrink: 0 }}>
          {line.tail}
        </span>
      )}
    </div>
  );
}

function LogPanel({ lines }) {
  return (
    <Panel style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <PanelHeader
        right={<Icons.maximize size={14} color="var(--ink-3)" />}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "var(--ok)",
            animation: "pulse-dot 1.2s infinite",
          }} />
          <div style={{ fontSize: 13, fontWeight: 700 }}>실시간 시스템 로그</div>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginLeft: 4 }}>{lines.length} EVENTS</span>
        </div>
      </PanelHeader>
      <div className="scroll" style={{
        padding: 10, flex: 1, overflow: "auto",
        background: "var(--bg-sunk)",
      }}>
        {lines.map((l) => <LogLine key={l.id} line={l} />)}
      </div>
    </Panel>
  );
}

function useLogStream(autoPlay) {
  const { LOG_TEMPLATES } = window.APP_DATA;
  const [lines, setLines] = useState(() => {
    // seed
    const seed = [
      { id: 1, time: "14:42:01", kind: "ok",    text: "CMD: PING NODE-012 ...", tail: "OK" },
      { id: 2, time: "14:42:03", kind: "data",  text: "DATA: NODE-015 RECV 2.4KB" },
      { id: 3, time: "14:42:05", kind: "alert", text: "ALERT: THRESHOLD EXCEEDED @ NODE-042" },
      { id: 4, time: "14:42:08", kind: "ok",    text: "SYS: DB BACKUP COMPLETED" },
      { id: 5, time: "14:42:10", kind: "ai",    text: "AI: SCANNING ANOMALIES..." },
      { id: 6, time: "14:42:12", kind: "auth",  text: "AUTH: OPERATOR_1 LOGIN" },
      { id: 7, time: "14:42:15", kind: "ok",    text: "CMD: PING NODE-013 ...", tail: "OK" },
      { id: 8, time: "14:42:18", kind: "warn",  text: "WARN: RETRY_FAIL @ NODE-055" },
      { id: 9, time: "14:42:20", kind: "data",  text: "DATA: NODE-018 RECV 1.1KB" },
      { id: 10, time: "14:42:25", kind: "ai",    text: "AI: ANALYSING TRENDS..." },
      { id: 11, time: "14:42:28", kind: "ok",    text: "SYS: HEARTBEAT SENT" },
    ];
    return seed;
  });
  const idRef = useRef(12);
  const tRef = useRef(new Date(2026, 2, 26, 14, 42, 30));

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const n = String(Math.floor(Math.random() * 120)).padStart(3, "0");
      tRef.current = new Date(tRef.current.getTime() + (1500 + Math.random() * 2500));
      const hh = String(tRef.current.getHours()).padStart(2, "0");
      const mm = String(tRef.current.getMinutes()).padStart(2, "0");
      const ss = String(tRef.current.getSeconds()).padStart(2, "0");
      const line = {
        id: idRef.current++,
        time: `${hh}:${mm}:${ss}`,
        kind: tpl.kind,
        text: tpl.t(n),
        tail: tpl.tail,
      };
      setLines((prev) => [...prev.slice(-40), line]);
    }, 1800);
    return () => clearInterval(t);
  }, [autoPlay]);

  return lines;
}

function AnalysisModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "rgba(10, 15, 30, 0.55)",
      backdropFilter: "blur(4px)",
      display: "grid", placeItems: "center",
      animation: "slide-in-up 200ms ease",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--bg-elev)", borderRadius: 20,
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-lg)",
        width: 760, maxHeight: "calc(100% - 80px)", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, var(--err), #ea580c)",
              display: "grid", placeItems: "center", color: "#fff",
              boxShadow: "0 6px 14px -4px rgba(239,68,68,0.5)",
            }}>
              <Icons.alert size={18} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{item.node}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{item.label} · {item.zone}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-3)", padding: 6 }}><Icons.close size={18} /></button>
        </div>

        <div className="scroll" style={{ padding: 24, overflowY: "auto" }}>
          {/* Stat row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "이상 스코어", value: item.mse.toFixed(3), accent: "var(--err)" },
              { label: "신뢰도", value: "94.2%", accent: "var(--brand)" },
              { label: "관측 기간", value: "15분", accent: "var(--ink-2)" },
              { label: "권장 조치", value: "즉시", accent: "var(--warn)" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "12px 14px", borderRadius: 12,
                background: "var(--bg-sunk)", border: "1px solid var(--line-soft)",
              }}>
                <div style={{ fontSize: 10, color: "var(--ink-3)", fontWeight: 600 }}>{s.label}</div>
                <div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: s.accent }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Chart — 3-band threshold viz */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>최근 24시간 이상 스코어 추이</div>
              <div style={{ display: "flex", gap: 10, fontSize: 10, color: "var(--ink-3)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 3, background: "rgba(16,185,129,0.35)" }} />정상
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 3, background: "rgba(245,158,11,0.35)" }} />관찰
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 3, background: "rgba(239,68,68,0.35)" }} />이상
                </span>
              </div>
            </div>
            <div style={{
              padding: 16, borderRadius: 12,
              background: "var(--bg-sunk)", border: "1px solid var(--line-soft)",
              height: 200,
            }}>
              <svg viewBox="0 0 640 140" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--err)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--err)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* 3-band background: 이상 (top) / 관찰 (mid) / 정상 (bottom) */}
                <rect x="0" y="0"   width="640" height="50"  fill="rgba(239,68,68,0.07)" />
                <rect x="0" y="50"  width="640" height="40"  fill="rgba(245,158,11,0.07)" />
                <rect x="0" y="90"  width="640" height="50"  fill="rgba(16,185,129,0.06)" />
                {/* Y-axis ticks */}
                <text x="4" y="12"  fontSize="9" fill="var(--ink-4)" fontFamily="JetBrains Mono">1.0</text>
                <text x="4" y="54"  fontSize="9" fill="var(--err)"   fontFamily="JetBrains Mono" fontWeight="700">0.60 ── 이상</text>
                <text x="4" y="94"  fontSize="9" fill="var(--warn)"  fontFamily="JetBrains Mono" fontWeight="700">0.40 ── 관찰</text>
                <text x="4" y="136" fontSize="9" fill="var(--ink-4)" fontFamily="JetBrains Mono">0.0</text>
                {/* Threshold lines */}
                <line x1="0" y1="50" x2="640" y2="50" stroke="var(--err)"  strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="90" x2="640" y2="90" stroke="var(--warn)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                {/* area + line */}
                <path d="M 0 120 L 30 115 L 60 118 L 90 110 L 120 112 L 150 105 L 180 100 L 210 105 L 240 95 L 270 85 L 300 75 L 330 60 L 360 50 L 390 40 L 420 32 L 450 38 L 480 28 L 510 30 L 540 20 L 570 15 L 600 22 L 640 18 L 640 140 L 0 140 Z"
                      fill="url(#a1)" />
                <path d="M 0 120 L 30 115 L 60 118 L 90 110 L 120 112 L 150 105 L 180 100 L 210 105 L 240 95 L 270 85 L 300 75 L 330 60 L 360 50 L 390 40 L 420 32 L 450 38 L 480 28 L 510 30 L 540 20 L 570 15 L 600 22 L 640 18"
                      fill="none" stroke="var(--err)" strokeWidth="2" />
                {/* anomaly spike marker */}
                <circle cx="540" cy="20" r="5" fill="var(--err)" />
                <circle cx="540" cy="20" r="10" fill="none" stroke="var(--err)" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="r" values="5;14;5" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="1.6s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>

          {/* Sensor contribution breakdown */}
          {item.contribution && item.contribution.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>센서별 이상 기여도</div>
              <div style={{
                padding: 16, borderRadius: 12,
                background: "var(--bg-sunk)", border: "1px solid var(--line-soft)",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                {item.contribution.map((c, i) => (
                  <div key={c.sensor}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? "var(--err)" : "var(--ink-2)" }}>{c.sensor}</span>
                      <span className="mono num" style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "var(--err)" : "var(--ink-2)" }}>{c.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "var(--bg-elev)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${c.pct}%`, height: "100%",
                        background: i === 0 ? "var(--err)" : i === 1 ? "var(--warn)" : "var(--ink-3)",
                        transition: "width 400ms",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Summary */}
          <div style={{
            padding: 16, borderRadius: 12,
            background: "var(--brand-wash)",
            border: "1px solid rgba(79,70,229,0.2)",
            marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icons.sparkle size={14} color="var(--brand)" />
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)" }}>AI 분석 요약</div>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{item.summary}</div>
          </div>
          <div style={{
            padding: 16, borderRadius: 12,
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icons.check size={14} color="var(--ok)" />
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ok)" }}>권장 조치</div>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{item.action}</div>
          </div>
        </div>

        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--line-soft)",
          display: "flex", gap: 10, justifyContent: "flex-end",
        }}>
          <button onClick={onClose} style={{
            padding: "10px 18px", borderRadius: 10,
            background: "var(--bg-sunk)", border: "1px solid var(--line)",
            fontSize: 13, fontWeight: 600, color: "var(--ink-2)",
          }}>닫기</button>
          <button style={{
            padding: "10px 18px", borderRadius: 10,
            background: "var(--brand)", color: "#fff",
            fontSize: 13, fontWeight: 700,
            boxShadow: "0 6px 14px -4px rgba(79,70,229,0.5)",
          }}>점검 워크오더 생성 →</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onAnalyze, mapStyle, setMapStyle, theme }) {
  const { EQUIPMENT, MAP_MARKERS, AI_ANOMALIES, AI_WATCH, AI_INSIGHTS } = window.APP_DATA;
  const [activeKpi, setActiveKpi] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [drawer, setDrawer] = useState(null);

  const counts = useMemo(() => {
    const c = { all: EQUIPMENT.length, normal: 0, anomaly: 0, warn: 0, offline: 0 };
    EQUIPMENT.forEach(e => c[e.status]++);
    return c;
  }, []);

  const tableData = useMemo(() => {
    if (!activeKpi || activeKpi === "all") return EQUIPMENT;
    return EQUIPMENT.filter(e => e.status === activeKpi);
  }, [activeKpi]);

  const lines = useLogStream(true);

  return (
    <>
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
        padding: 24,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {/* KPIs */}
        <KPIRow active={activeKpi} setActive={setActiveKpi} counts={counts} />

        {/* Middle grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 440px",
          gap: 16, flex: 1, minHeight: 0,
        }}>
          {/* Left: Map + Table stacked */}
          <div style={{ display: "grid", gridTemplateRows: "minmax(360px, 1.2fr) minmax(260px, 1fr)", gap: 16, minHeight: 0 }}>
            <MapPanelWrap markers={MAP_MARKERS} onMarker={setActiveMarker}
                          activeMarker={activeMarker} mapStyle={mapStyle} theme={theme} setMapStyle={setMapStyle} />
            <TableSummary data={tableData} onRowClick={setDrawer} />
          </div>
          {/* Right: AI panels stacked */}
          <div style={{ display: "grid", gridTemplateRows: "minmax(220px, 1.1fr) minmax(200px, 1fr) minmax(160px, 0.9fr)", gap: 16, minHeight: 0 }}>
            <AIPanels anomalies={AI_ANOMALIES} watch={AI_WATCH} onAnalyze={onAnalyze} />
            <AIAdvicePanel insights={AI_INSIGHTS} />
            <LogPanel lines={lines} />
          </div>
        </div>
      </div>
      <EquipmentDrawer item={drawer} onClose={() => setDrawer(null)} />
    </>
  );
}

function EquipmentDrawer({ item, onClose }) {
  if (!item) return null;
  const c = statusChip(item.status);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 90, pointerEvents: "none",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(10,15,30,0.3)",
        backdropFilter: "blur(2px)",
        pointerEvents: "auto",
        animation: "slide-in-up 180ms ease",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 520,
        background: "var(--bg-elev)",
        borderLeft: "1px solid var(--line)",
        boxShadow: "var(--shadow-lg)",
        pointerEvents: "auto",
        display: "flex", flexDirection: "column",
        animation: "slide-in-up 220ms ease",
      }}>
        <div style={{
          padding: 24, borderBottom: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "space-between", alignItems: "start",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 18, fontWeight: 800 }}>{item.deviceId}</span>
              <span style={{
                padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
              }}>{c.ko}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{item.facilityId} · {item.zone}</div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 10 }}>{item.location}</div>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-3)" }}><Icons.close size={18} /></button>
        </div>
        <div className="scroll" style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", marginBottom: 10 }}>실시간 측정값</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { l: "방식전위", v: `${item.volt}mV`, a: item.status === "anomaly" && (item.label === "방식전위 이탈" || item.label === "위상차 급변") ? "var(--err)" : "var(--ok)" },
              { l: "AC 유입", v: `${item.ac.toLocaleString()}mV`, a: item.status === "anomaly" && item.label === "AC 유입 과다" ? "var(--err)" : null },
              { l: "희생전류",  v: `${item.sacrificial}mA`, a: item.status === "anomaly" && item.label === "희생전류 저하" ? "var(--err)" : null },
              { l: "온도",     v: `${item.temp}°C` },
              { l: "습도",     v: `${item.hum}%` },
              { l: "통신품질", v: item.commOk ? `${item.commDbm}dBm` : "단절", a: !item.commOk || (item.commOk && item.commDbm < -75) ? "var(--err)" : null },
            ].map(s => (
              <div key={s.l} style={{
                padding: "12px 14px", borderRadius: 10,
                background: "var(--bg-sunk)", border: "1px solid var(--line-soft)",
              }}>
                <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{s.l}</div>
                <div className="mono num" style={{ fontSize: 20, fontWeight: 700, marginTop: 2, color: s.a || "var(--ink)" }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", marginBottom: 10 }}>방식전위 트렌드 (6시간)</div>
          <div style={{
            padding: 12, borderRadius: 10,
            background: "var(--bg-sunk)", border: "1px solid var(--line-soft)",
            height: 120, marginBottom: 20,
          }}>
            <svg viewBox="0 0 440 96" style={{ width: "100%", height: "100%" }}>
              <polyline fill="none" stroke="var(--brand)" strokeWidth="2"
                        points="0,70 40,68 80,72 120,65 160,68 200,60 240,55 280,50 320,45 360,40 400,38 440,42" />
            </svg>
          </div>
          <button style={{
            width: "100%", padding: "12px", borderRadius: 10,
            background: "var(--brand)", color: "#fff",
            fontSize: 13, fontWeight: 700,
          }}>상세 리포트 생성</button>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.AnalysisModal = AnalysisModal;
