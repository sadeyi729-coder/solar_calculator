import { useState, useCallback, useMemo } from "react";

// ── Nigerian solar market data ─────────────────────────────────────────────
const PANEL_BRANDS = [
  { brand: "Felicity Solar", models: [
    { model: "FSP-150W", watt: 150, voc: 22.3, vmp: 18.5, isc: 8.71, imp: 8.11, weight: 10.5 },
    { model: "FSP-200W", watt: 200, voc: 24.3, vmp: 20.1, isc: 10.56, imp: 9.95, weight: 13.0 },
    { model: "FSP-300W", watt: 300, voc: 40.8, vmp: 34.2, isc: 9.58, imp: 8.78, weight: 18.5 },
    { model: "FSP-400W", watt: 400, voc: 49.5, vmp: 41.6, isc: 10.09, imp: 9.61, weight: 21.0 },
  ]},
  { brand: "Luminous Solar", models: [
    { model: "LRP-150W", watt: 150, voc: 22.1, vmp: 18.3, isc: 8.60, imp: 8.20, weight: 11.0 },
    { model: "LRP-260W", watt: 260, voc: 37.5, vmp: 31.0, isc: 9.02, imp: 8.40, weight: 18.0 },
    { model: "LRP-350W", watt: 350, voc: 46.8, vmp: 39.5, isc: 9.62, imp: 8.87, weight: 20.5 },
  ]},
  { brand: "Jinko Solar (Popular in NG)", models: [
    { model: "JKM-300M", watt: 300, voc: 40.3, vmp: 33.1, isc: 9.62, imp: 9.06, weight: 18.2 },
    { model: "JKM-400M", watt: 400, voc: 49.9, vmp: 41.8, isc: 10.45, imp: 9.58, weight: 21.3 },
    { model: "JKM-540M", watt: 540, voc: 49.9, vmp: 41.8, isc: 13.89, imp: 12.93, weight: 27.2 },
  ]},
  { brand: "Canadian Solar (Common NG)", models: [
    { model: "CS3N-370W", watt: 370, voc: 45.3, vmp: 37.8, isc: 10.38, imp: 9.79, weight: 20.5 },
    { model: "CS3W-400W", watt: 400, voc: 49.2, vmp: 41.8, isc: 10.24, imp: 9.57, weight: 21.5 },
    { model: "CS3W-500W", watt: 500, voc: 49.2, vmp: 41.8, isc: 12.96, imp: 11.97, weight: 25.5 },
  ]},
  { brand: "Loom Solar (Emerging NG)", models: [
    { model: "SHARK-325W", watt: 325, voc: 40.2, vmp: 33.9, isc: 9.83, imp: 9.59, weight: 19.5 },
    { model: "SHARK-440W", watt: 440, voc: 49.8, vmp: 42.0, isc: 10.99, imp: 10.48, weight: 22.5 },
  ]},
  { brand: "Phocos / Generic 12V", models: [
    { model: "Poly-100W-12V", watt: 100, voc: 21.6, vmp: 17.5, isc: 6.11, imp: 5.72, weight: 8.0 },
    { model: "Poly-200W-24V", watt: 200, voc: 43.2, vmp: 35.0, isc: 6.11, imp: 5.72, weight: 14.5 },
  ]},
];

const INVERTER_BRANDS = [
  { brand: "Felicity Solar Inverter", models: [
    { model: "FELI-1KVA-12V", kva: 1, watts: 800, voltage: 12, type: "Pure Sine", efficiency: 0.90, price: "₦85,000" },
    { model: "FELI-2KVA-24V", kva: 2, watts: 1600, voltage: 24, type: "Pure Sine", efficiency: 0.91, price: "₦150,000" },
    { model: "FELI-3KVA-24V", kva: 3, watts: 2400, voltage: 24, type: "Pure Sine", efficiency: 0.92, price: "₦210,000" },
    { model: "FELI-5KVA-48V", kva: 5, watts: 4000, voltage: 48, type: "Pure Sine", efficiency: 0.93, price: "₦320,000" },
    { model: "FELI-10KVA-48V", kva: 10, watts: 8000, voltage: 48, type: "Pure Sine", efficiency: 0.94, price: "₦580,000" },
  ]},
  { brand: "Luminous Inverter", models: [
    { model: "CRUZE-1.5KVA-24V", kva: 1.5, watts: 1200, voltage: 24, type: "Pure Sine", efficiency: 0.89, price: "₦120,000" },
    { model: "HKVA-2KVA-24V", kva: 2, watts: 1600, voltage: 24, type: "Pure Sine", efficiency: 0.90, price: "₦165,000" },
    { model: "REGALIA-3.5KVA-48V", kva: 3.5, watts: 2800, voltage: 48, type: "Pure Sine", efficiency: 0.92, price: "₦290,000" },
  ]},
  { brand: "Sukam Inverter", models: [
    { model: "SHAKTIMAN-2KVA-24V", kva: 2, watts: 1600, voltage: 24, type: "Pure Sine", efficiency: 0.88, price: "₦155,000" },
    { model: "FALCON-5KVA-48V", kva: 5, watts: 4000, voltage: 48, type: "Pure Sine", efficiency: 0.91, price: "₦310,000" },
    { model: "SOLAR-10KVA-48V", kva: 10, watts: 8000, voltage: 48, type: "Pure Sine", efficiency: 0.93, price: "₦560,000" },
  ]},
  { brand: "Victron Energy (Premium)", models: [
    { model: "MultiPlus-3KVA-24V", kva: 3, watts: 2400, voltage: 24, type: "Pure Sine", efficiency: 0.95, price: "₦480,000" },
    { model: "MultiPlus-5KVA-48V", kva: 5, watts: 4000, voltage: 48, type: "Pure Sine", efficiency: 0.96, price: "₦780,000" },
  ]},
  { brand: "Prag/Genus (Budget)", models: [
    { model: "PRAG-1KVA-12V", kva: 1, watts: 800, voltage: 12, type: "Mod. Sine", efficiency: 0.85, price: "₦65,000" },
    { model: "PRAG-2KVA-24V", kva: 2, watts: 1600, voltage: 24, type: "Mod. Sine", efficiency: 0.86, price: "₦130,000" },
    { model: "PRAG-5KVA-48V", kva: 5, watts: 4000, voltage: 48, type: "Mod. Sine", efficiency: 0.88, price: "₦290,000" },
  ]},
];

const CHARGE_CONTROLLERS = [
  { brand: "Victron SmartSolar MPPT", models: [
    { model: "MPPT-75/15", type: "MPPT", maxPV: 75, maxCurrent: 15, voltage: [12, 24], price: "₦55,000" },
    { model: "MPPT-100/30", type: "MPPT", maxPV: 100, maxCurrent: 30, voltage: [12, 24], price: "₦85,000" },
    { model: "MPPT-150/60", type: "MPPT", maxPV: 150, maxCurrent: 60, voltage: [12, 24, 48], price: "₦175,000" },
    { model: "MPPT-250/100", type: "MPPT", maxPV: 250, maxCurrent: 100, voltage: [12, 24, 48], price: "₦380,000" },
  ]},
  { brand: "Epever MPPT", models: [
    { model: "Tracer-3210AN", type: "MPPT", maxPV: 100, maxCurrent: 30, voltage: [12, 24], price: "₦45,000" },
    { model: "Tracer-4215BN", type: "MPPT", maxPV: 150, maxCurrent: 40, voltage: [12, 24], price: "₦70,000" },
    { model: "Tracer-6415AN", type: "MPPT", maxPV: 150, maxCurrent: 60, voltage: [12, 24, 48], price: "₦115,000" },
    { model: "Tracer-AN-100A", type: "MPPT", maxPV: 250, maxCurrent: 100, voltage: [12, 24, 36, 48], price: "₦220,000" },
  ]},
  { brand: "Felicity MPPT", models: [
    { model: "FELMPPT-30A", type: "MPPT", maxPV: 100, maxCurrent: 30, voltage: [12, 24], price: "₦38,000" },
    { model: "FELMPPT-60A", type: "MPPT", maxPV: 150, maxCurrent: 60, voltage: [12, 24, 48], price: "₦85,000" },
  ]},
  { brand: "PWM Budget (Generic NG)", models: [
    { model: "PWM-30A", type: "PWM", maxPV: null, maxCurrent: 30, voltage: [12, 24], price: "₦8,500" },
    { model: "PWM-60A", type: "PWM", maxPV: null, maxCurrent: 60, voltage: [12, 24], price: "₦16,000" },
  ]},
];

const BATTERY_BANKS = [
  { brand: "Felicity Lithium", models: [
    { model: "LiFePO4-100Ah-24V", capacity: 100, voltage: 24, type: "LiFePO4", dod: 0.90, cycles: 3000, price: "₦450,000" },
    { model: "LiFePO4-200Ah-24V", capacity: 200, voltage: 24, type: "LiFePO4", dod: 0.90, cycles: 3000, price: "₦820,000" },
    { model: "LiFePO4-100Ah-48V", capacity: 100, voltage: 48, type: "LiFePO4", dod: 0.90, cycles: 3000, price: "₦880,000" },
  ]},
  { brand: "Trojan Flooded (Deep Cycle)", models: [
    { model: "T-105-6V-225Ah", capacity: 225, voltage: 6, type: "Flooded", dod: 0.50, cycles: 750, price: "₦85,000" },
    { model: "T-145-6V-260Ah", capacity: 260, voltage: 6, type: "Flooded", dod: 0.50, cycles: 800, price: "₦100,000" },
  ]},
  { brand: "Luminous Tubular", models: [
    { model: "LPTT-150Ah-12V", capacity: 150, voltage: 12, type: "Tubular", dod: 0.60, cycles: 500, price: "₦95,000" },
    { model: "LPTT-200Ah-12V", capacity: 200, voltage: 12, type: "Tubular", dod: 0.60, cycles: 500, price: "₦125,000" },
  ]},
  { brand: "Generic Sealed Lead Acid", models: [
    { model: "SLA-100Ah-12V", capacity: 100, voltage: 12, type: "VRLA/AGM", dod: 0.50, cycles: 300, price: "₦55,000" },
    { model: "SLA-200Ah-12V", capacity: 200, voltage: 12, type: "VRLA/AGM", dod: 0.50, cycles: 300, price: "₦100,000" },
  ]},
];

const DEFAULT_APPLIANCES = [
  { id: 1, name: "LED Light (9W)", watts: 9, qty: 6, hours: 6, enabled: true },
  { id: 2, name: "Ceiling Fan", watts: 60, qty: 2, hours: 8, enabled: true },
  { id: 3, name: "LED TV (32\")", watts: 60, qty: 1, hours: 6, enabled: true },
  { id: 4, name: "Refrigerator", watts: 150, qty: 1, hours: 24, enabled: true },
  { id: 5, name: "Phone Charger", watts: 10, qty: 4, hours: 3, enabled: true },
  { id: 6, name: "Laptop", watts: 65, qty: 1, hours: 6, enabled: false },
  { id: 7, name: "Water Pump (0.5HP)", watts: 375, qty: 1, hours: 2, enabled: false },
  { id: 8, name: "Air Conditioner (1HP)", watts: 750, qty: 1, hours: 8, enabled: false },
];

const PEAK_SUN_HOURS = { North: 6.5, South: 5.0, Lagos: 5.2, Abuja: 6.0, Kano: 7.0, PortHarcourt: 4.8 };

// ── Helpers ────────────────────────────────────────────────────────────────
function calcSeriesParallel(panel, inverterVoltage, totalPanelWatts) {
  const panelVmp = panel.vmp;
  const panelVoc = panel.voc;
  const panelImp = panel.imp;
  const panelIsc = panel.isc;

  // Series panels to meet inverter battery voltage (charge voltage ~1.2× battery voltage)
  // MPPT controllers: string Voc must be < controller max PV voltage
  const chargingVoltage = inverterVoltage * 1.2; // e.g. 48V * 1.2 = 57.6V
  const seriesForVoltage = Math.max(1, Math.ceil(chargingVoltage / panelVmp));

  const totalNeeded = Math.ceil(totalPanelWatts / panel.watt);
  const parallelStrings = Math.max(1, Math.ceil(totalNeeded / seriesForVoltage));
  const actual = seriesForVoltage * parallelStrings;

  const stringVoc = panelVoc * seriesForVoltage;
  const stringVmp = panelVmp * seriesForVoltage;
  const totalIsc = panelIsc * parallelStrings;
  const totalImp = panelImp * parallelStrings;
  const totalWatts = actual * panel.watt;

  return { seriesPerString: seriesForVoltage, parallelStrings, totalPanels: actual, stringVoc, stringVmp, totalIsc, totalImp, totalWatts };
}

function recommendCC(totalIsc, inverterVoltage, controllers) {
  const required = totalIsc * 1.25;
  const all = controllers.flatMap(b => b.models.map(m => ({ ...m, brand: b.brand })));
  return all.filter(c => c.maxCurrent >= required && c.voltage.includes(inverterVoltage))
    .sort((a, b) => a.maxCurrent - b.maxCurrent);
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function SolarCalc() {
  const [appliances, setAppliances] = useState(DEFAULT_APPLIANCES);
  const [newAppliance, setNewAppliance] = useState({ name: "", watts: "", qty: 1, hours: 1 });
  const [location, setLocation] = useState("Lagos");
  const [autonomyDays, setAutonomyDays] = useState(1);
  const [selectedPanel, setSelectedPanel] = useState({ brandIdx: 0, modelIdx: 2 });
  const [selectedInverter, setSelectedInverter] = useState({ brandIdx: 0, modelIdx: 2 });
  const [selectedBattery, setSelectedBattery] = useState({ brandIdx: 2, modelIdx: 0 });
  const [activeTab, setActiveTab] = useState("audit");
  const [systemLoss, setSystemLoss] = useState(25);
  const SURGE_FACTOR = 1.20;

  const psh = PEAK_SUN_HOURS[location] || 5.2;

  // ── Power Audit ────────────────────────────────────────────────────────
  const audit = useMemo(() => {
    const items = appliances.filter(a => a.enabled).map(a => ({
      ...a, daily: a.watts * a.qty * a.hours
    }));
    const totalWh = items.reduce((s, a) => s + a.daily, 0);
    const peakW = appliances.filter(a => a.enabled).reduce((s, a) => s + a.watts * a.qty, 0);
    const adjustedWh = totalWh / (1 - systemLoss / 100);
    const surgeWh = adjustedWh * SURGE_FACTOR;
    const surgePeakW = peakW * SURGE_FACTOR;
    return { items, totalWh, peakW, adjustedWh, surgeWh, surgePeakW };
  }, [appliances, systemLoss]);

  // ── Component selections ───────────────────────────────────────────────
  const panel = PANEL_BRANDS[selectedPanel.brandIdx].models[selectedPanel.modelIdx];
  const inverter = INVERTER_BRANDS[selectedInverter.brandIdx].models[selectedInverter.modelIdx];
  const battery = BATTERY_BANKS[selectedBattery.brandIdx].models[selectedBattery.modelIdx];

  // ── System Sizing ──────────────────────────────────────────────────────
  const sizing = useMemo(() => {
    const { surgeWh, surgePeakW, adjustedWh } = audit;

    // Required inverter: surge peak × 1.25 NEC safety factor
    const requiredInverterW = surgePeakW * 1.25;

    // Total panel watts: surge-adjusted energy / PSH
    const totalPanelWatts = surgeWh / psh;
    const basePanelWatts = adjustedWh / psh;

    // Panel config
    const config = calcSeriesParallel(panel, inverter.voltage, totalPanelWatts);

    // Battery sizing uses surge-adjusted Wh
    const batteryCapacityWh = surgeWh * autonomyDays;
    const batteryCapacityAh = batteryCapacityWh / battery.voltage;
    const usableAh = battery.capacity * battery.dod;
    const batteriesNeeded = Math.ceil(batteryCapacityAh / usableAh);

    const batteriesInSeries = Math.ceil(inverter.voltage / battery.voltage);
    const parallelBatteryStrings = Math.max(1, Math.ceil(batteriesNeeded / batteriesInSeries));
    const totalBatteries = batteriesInSeries * parallelBatteryStrings;

    const ccOptions = recommendCC(config.totalIsc, inverter.voltage, CHARGE_CONTROLLERS);

    return {
      requiredInverterW,
      totalPanelWatts,
      basePanelWatts,
      config,
      batteryCapacityAh,
      batteriesNeeded,
      batteriesInSeries,
      parallelBatteryStrings,
      totalBatteries,
      ccOptions,
      actualSystemWh: config.totalWatts * psh * (1 - systemLoss / 100),
    };
  }, [audit, panel, inverter, battery, psh, autonomyDays, systemLoss]);

  // ── Alternative panel configs ──────────────────────────────────────────
  const altConfigs = useMemo(() => {
    return PANEL_BRANDS.flatMap((b, bi) =>
      b.models.map((m, mi) => {
        const cfg = calcSeriesParallel(m, inverter.voltage, audit.surgeWh / psh);
        return { brand: b.brand, model: m.model, watt: m.watt, ...cfg, bi, mi };
      })
    );
  }, [audit.surgeWh, inverter.voltage, psh]);

  // ── Appliance handlers ─────────────────────────────────────────────────
  const toggleAppliance = id => setAppliances(a => a.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  const updateAppliance = (id, field, val) => setAppliances(a => a.map(x => x.id === id ? { ...x, [field]: +val || val } : x));
  const removeAppliance = id => setAppliances(a => a.filter(x => x.id !== id));
  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.watts) return;
    setAppliances(a => [...a, { ...newAppliance, id: Date.now(), watts: +newAppliance.watts, qty: +newAppliance.qty, hours: +newAppliance.hours, enabled: true }]);
    setNewAppliance({ name: "", watts: "", qty: 1, hours: 1 });
  };

  const tabs = ["audit", "components", "sizing", "configs", "summary"];
  const tabLabels = { audit: "⚡ Power Audit", components: "🔧 Components", sizing: "📐 Sizing", configs: "🔢 Configurations", summary: "📋 Summary" };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", background: "#0a0f0a", minHeight: "100vh", color: "#e8f5e9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0f0a; } ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 3px; }
        input, select { background: #111a11; border: 1px solid #2d4a2d; color: #e8f5e9; padding: 6px 10px; border-radius: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; width: 100%; }
        input:focus, select:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,0.15); }
        input[type="checkbox"] { width: auto; accent-color: #f59e0b; }
        button { cursor: pointer; font-family: 'IBM Plex Mono', monospace; font-weight: 600; letter-spacing: 0.05em; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1a2e1a; color: #f59e0b; font-size: 10px; letter-spacing: 0.1em; padding: 8px 10px; text-align: left; }
        td { padding: 7px 10px; border-bottom: 1px solid #1a2e1a; }
        tr:hover td { background: #111a11; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; }
        .badge-amber { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
        .badge-green { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
        .badge-red { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
        .badge-blue { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
        .card { background: #0e170e; border: 1px solid #1e3a1e; border-radius: 8px; padding: 16px; }
        .metric-box { background: #111a11; border: 1px solid #2d4a2d; border-radius: 6px; padding: 12px 16px; text-align: center; }
        .metric-val { font-size: 28px; font-weight: 700; color: #f59e0b; font-family: 'Bebas Neue', cursive; letter-spacing: 0.05em; line-height: 1; }
        .metric-unit { font-size: 10px; color: #6b9e6b; margin-top: 2px; }
        .metric-label { font-size: 10px; color: #4a7a4a; margin-top: 4px; letter-spacing: 0.08em; }
        .warn-box { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #fcd34d; }
        .ok-box { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #86efac; }
        .section-title { font-family: 'Bebas Neue', cursive; font-size: 18px; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media(max-width: 700px) { .grid2, .grid3, .grid4 { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 480px) { .grid2, .grid3, .grid4 { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0e1f0e 0%, #1a3a0a 50%, #0e1f0e 100%)", borderBottom: "2px solid #2d5a1a", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 52, height: 52, background: "linear-gradient(135deg, #f59e0b, #ea580c)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>☀️</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, letterSpacing: "0.1em", color: "#f59e0b", lineHeight: 1 }}>NAIJA SOLAR SIZER</div>
              <div style={{ fontSize: 11, color: "#6b9e6b", letterSpacing: "0.15em", marginTop: 4 }}>NIGERIAN SOLAR SYSTEM DESIGN & SPECIFICATION CALCULATOR</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div className="metric-box" style={{ minWidth: 100 }}>
                <div className="metric-val">{(audit.surgeWh / 1000).toFixed(2)}</div>
                <div className="metric-unit">kWh/day</div>
                <div className="metric-label">DESIGN LOAD ⚡</div>
              </div>
              <div className="metric-box" style={{ minWidth: 100 }}>
                <div className="metric-val">{sizing.config.totalPanels}</div>
                <div className="metric-unit">panels</div>
                <div className="metric-label">REQUIRED</div>
              </div>
              <div className="metric-box" style={{ minWidth: 110 }}>
                <div className="metric-val">{inverter.kva}</div>
                <div className="metric-unit">kVA / {inverter.voltage}V</div>
                <div className="metric-label">INVERTER</div>
              </div>
              <div style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.5)", borderRadius: 6, padding: "8px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "#fb923c", lineHeight: 1 }}>+20%</div>
                <div style={{ fontSize: 9, color: "#fbbf24", letterSpacing: "0.1em", marginTop: 2 }}>SURGE FACTOR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#0a0f0a", borderBottom: "1px solid #1e3a1e", padding: "0 24px", overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px 18px", background: activeTab === t ? "#f59e0b" : "transparent", color: activeTab === t ? "#0a0f0a" : "#6b9e6b", border: "none", borderBottom: activeTab === t ? "none" : "2px solid transparent", fontSize: 11, letterSpacing: "0.08em", transition: "all 0.15s", whiteSpace: "nowrap" }}>
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>

        {/* ── TAB: POWER AUDIT ── */}
        {activeTab === "audit" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 10, color: "#6b9e6b", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>LOCATION / REGION</label>
                <select value={location} onChange={e => setLocation(e.target.value)}>
                  {Object.entries(PEAK_SUN_HOURS).map(([k, v]) => <option key={k} value={k}>{k} — {v} PSH/day</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 10, color: "#6b9e6b", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>SYSTEM LOSSES (%)</label>
                <select value={systemLoss} onChange={e => setSystemLoss(+e.target.value)}>
                  {[15, 20, 25, 30, 35].map(v => <option key={v} value={v}>{v}% ({v <= 20 ? "Excellent" : v <= 25 ? "Good" : "Average"} install)</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 10, color: "#6b9e6b", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>BATTERY AUTONOMY (DAYS)</label>
                <select value={autonomyDays} onChange={e => setAutonomyDays(+e.target.value)}>
                  {[0.5, 1, 1.5, 2, 3].map(v => <option key={v} value={v}>{v} day{v !== 1 ? "s" : ""}</option>)}
                </select>
              </div>
            </div>

            {/* Surge banner */}
            <div style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.4)", borderRadius: 6, padding: "10px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontSize: 11, color: "#fcd34d", fontWeight: 700, letterSpacing: "0.08em" }}>SURGE BUFFER ACTIVE — +20%</span>
              <span style={{ fontSize: 11, color: "#fbbf24" }}>All panel, inverter &amp; battery sizing inflated ×1.20 to handle motor/compressor inrush surge currents.</span>
              <span className="badge badge-amber" style={{ marginLeft: "auto", flexShrink: 0 }}>SURGE ×1.20</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
              <div className="metric-box">
                <div className="metric-val">{audit.totalWh.toFixed(0)}</div>
                <div className="metric-unit">Wh/day</div>
                <div className="metric-label">GROSS LOAD</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{audit.adjustedWh.toFixed(0)}</div>
                <div className="metric-unit">Wh/day</div>
                <div className="metric-label">ADJ. (+{systemLoss}% loss)</div>
              </div>
              <div className="metric-box" style={{ border: "1px solid rgba(251,146,60,0.55)" }}>
                <div className="metric-val" style={{ color: "#fb923c" }}>{audit.surgeWh.toFixed(0)}</div>
                <div className="metric-unit">Wh/day</div>
                <div className="metric-label">SURGE DESIGN Wh</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{audit.peakW}</div>
                <div className="metric-unit">W</div>
                <div className="metric-label">PEAK DEMAND</div>
              </div>
              <div className="metric-box" style={{ border: "1px solid rgba(251,146,60,0.55)" }}>
                <div className="metric-val" style={{ color: "#fb923c" }}>{audit.surgePeakW.toFixed(0)}</div>
                <div className="metric-unit">W</div>
                <div className="metric-label">SURGE PEAK W</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{psh}</div>
                <div className="metric-unit">hrs/day</div>
                <div className="metric-label">PEAK SUN HRS</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">📋 APPLIANCE LOAD TABLE</div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>ON</th><th>APPLIANCE</th><th>WATTS</th><th>QTY</th><th>HRS/DAY</th><th>DAILY (Wh)</th><th>% LOAD</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliances.map(a => {
                      const daily = a.watts * a.qty * a.hours;
                      const pct = audit.totalWh > 0 ? (daily / audit.totalWh * 100).toFixed(1) : 0;
                      return (
                        <tr key={a.id} style={{ opacity: a.enabled ? 1 : 0.4 }}>
                          <td><input type="checkbox" checked={a.enabled} onChange={() => toggleAppliance(a.id)} /></td>
                          <td style={{ fontWeight: 600, color: "#d4f0d4" }}>{a.name}</td>
                          <td><input type="number" value={a.watts} onChange={e => updateAppliance(a.id, "watts", e.target.value)} style={{ width: 70 }} /></td>
                          <td><input type="number" value={a.qty} onChange={e => updateAppliance(a.id, "qty", e.target.value)} style={{ width: 50 }} min={1} /></td>
                          <td><input type="number" value={a.hours} onChange={e => updateAppliance(a.id, "hours", e.target.value)} style={{ width: 60 }} min={0.5} max={24} step={0.5} /></td>
                          <td style={{ color: a.enabled ? "#f59e0b" : "#4a7a4a", fontWeight: 700 }}>{daily.toFixed(0)}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ height: 6, width: `${Math.min(pct, 100)}%`, maxWidth: 60, background: "#f59e0b", borderRadius: 3, minWidth: 4 }} />
                              <span style={{ fontSize: 10, color: "#6b9e6b" }}>{pct}%</span>
                            </div>
                          </td>
                          <td><button onClick={() => removeAppliance(a.id)} style={{ background: "transparent", border: "1px solid #3d1a1a", color: "#f87171", padding: "3px 8px", borderRadius: 3, fontSize: 11 }}>✕</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add appliance */}
            <div className="card">
              <div className="section-title" style={{ fontSize: 14, marginBottom: 10 }}>➕ ADD APPLIANCE</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input placeholder="Appliance name" value={newAppliance.name} onChange={e => setNewAppliance(p => ({ ...p, name: e.target.value }))} style={{ flex: 2, minWidth: 140 }} />
                <input type="number" placeholder="Watts" value={newAppliance.watts} onChange={e => setNewAppliance(p => ({ ...p, watts: e.target.value }))} style={{ width: 80 }} />
                <input type="number" placeholder="Qty" value={newAppliance.qty} onChange={e => setNewAppliance(p => ({ ...p, qty: e.target.value }))} style={{ width: 60 }} min={1} />
                <input type="number" placeholder="Hrs/day" value={newAppliance.hours} onChange={e => setNewAppliance(p => ({ ...p, hours: e.target.value }))} style={{ width: 80 }} min={0.5} step={0.5} />
                <button onClick={addAppliance} style={{ background: "#f59e0b", color: "#0a0f0a", border: "none", padding: "6px 18px", borderRadius: 4, fontSize: 12 }}>ADD</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: COMPONENTS ── */}
        {activeTab === "components" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Panel Selection */}
            <div className="card">
              <div className="section-title">🌞 SOLAR PANEL SELECTION</div>
              <div className="grid2" style={{ marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#6b9e6b", display: "block", marginBottom: 4 }}>BRAND</label>
                  <select value={selectedPanel.brandIdx} onChange={e => setSelectedPanel({ brandIdx: +e.target.value, modelIdx: 0 })}>
                    {PANEL_BRANDS.map((b, i) => <option key={i} value={i}>{b.brand}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#6b9e6b", display: "block", marginBottom: 4 }}>MODEL</label>
                  <select value={selectedPanel.modelIdx} onChange={e => setSelectedPanel(p => ({ ...p, modelIdx: +e.target.value }))}>
                    {PANEL_BRANDS[selectedPanel.brandIdx].models.map((m, i) => <option key={i} value={i}>{m.model} — {m.watt}W</option>)}
                  </select>
                </div>
              </div>
              <table>
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>PARAMETER</th><th>VALUE</th></tr></thead>
                <tbody>
                  <tr><td>Rated Power (Pmax)</td><td><b>{panel.watt} W</b></td><td>Open Circuit Voltage (Voc)</td><td style={{ color: "#f59e0b" }}>{panel.voc} V</td></tr>
                  <tr><td>Max Power Voltage (Vmp)</td><td style={{ color: "#4ade80" }}>{panel.vmp} V</td><td>Short Circuit Current (Isc)</td><td style={{ color: "#60a5fa" }}>{panel.isc} A</td></tr>
                  <tr><td>Max Power Current (Imp)</td><td>{panel.imp} A</td><td>Weight</td><td>{panel.weight} kg</td></tr>
                </tbody>
              </table>
            </div>

            {/* Inverter Selection */}
            <div className="card">
              <div className="section-title">🔋 INVERTER SELECTION</div>
              {audit.surgePeakW * 1.25 > inverter.watts && (
                <div className="warn-box" style={{ marginBottom: 12 }}>⚠️ Selected inverter ({inverter.watts}W) may be undersized! Surge peak ({audit.surgePeakW.toFixed(0)}W) × 1.25 safety = {Math.ceil(audit.surgePeakW * 1.25)}W required.</div>
              )}
              {audit.surgePeakW * 1.25 <= inverter.watts && (
                <div className="ok-box" style={{ marginBottom: 12 }}>✓ Inverter adequately sized. Surge peak {audit.surgePeakW.toFixed(0)}W × 1.25 = {Math.ceil(audit.surgePeakW * 1.25)}W ≤ {inverter.watts}W rated. (Base: {audit.peakW}W × 1.20 surge × 1.25 = {Math.ceil(audit.surgePeakW * 1.25)}W)</div>
              )}
              <div className="grid2" style={{ marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#6b9e6b", display: "block", marginBottom: 4 }}>BRAND</label>
                  <select value={selectedInverter.brandIdx} onChange={e => setSelectedInverter({ brandIdx: +e.target.value, modelIdx: 0 })}>
                    {INVERTER_BRANDS.map((b, i) => <option key={i} value={i}>{b.brand}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#6b9e6b", display: "block", marginBottom: 4 }}>MODEL</label>
                  <select value={selectedInverter.modelIdx} onChange={e => setSelectedInverter(p => ({ ...p, modelIdx: +e.target.value }))}>
                    {INVERTER_BRANDS[selectedInverter.brandIdx].models.map((m, i) => <option key={i} value={i}>{m.model} — {m.kva}kVA</option>)}
                  </select>
                </div>
              </div>
              <table>
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>PARAMETER</th><th>VALUE</th></tr></thead>
                <tbody>
                  <tr><td>Capacity</td><td><b>{inverter.kva} kVA / {inverter.watts} W</b></td><td>Battery Voltage</td><td style={{ color: "#f59e0b" }}>{inverter.voltage} V DC</td></tr>
                  <tr><td>Output Type</td><td><span className="badge badge-green">{inverter.type}</span></td><td>Efficiency</td><td style={{ color: "#4ade80" }}>{(inverter.efficiency * 100).toFixed(0)}%</td></tr>
                  <tr><td>Est. Market Price</td><td style={{ color: "#fcd34d" }}>{inverter.price}</td><td>Required Load (surge)</td><td style={{ color: audit.surgePeakW * 1.25 > inverter.watts ? "#f87171" : "#4ade80" }}>{Math.ceil(audit.surgePeakW * 1.25)} W ⚡</td></tr>
                </tbody>
              </table>
            </div>

            {/* Battery Selection */}
            <div className="card">
              <div className="section-title">🔌 BATTERY BANK SELECTION</div>
              <div className="grid2" style={{ marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#6b9e6b", display: "block", marginBottom: 4 }}>BRAND</label>
                  <select value={selectedBattery.brandIdx} onChange={e => setSelectedBattery({ brandIdx: +e.target.value, modelIdx: 0 })}>
                    {BATTERY_BANKS.map((b, i) => <option key={i} value={i}>{b.brand}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#6b9e6b", display: "block", marginBottom: 4 }}>MODEL</label>
                  <select value={selectedBattery.modelIdx} onChange={e => setSelectedBattery(p => ({ ...p, modelIdx: +e.target.value }))}>
                    {BATTERY_BANKS[selectedBattery.brandIdx].models.map((m, i) => <option key={i} value={i}>{m.model}</option>)}
                  </select>
                </div>
              </div>
              <table>
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>PARAMETER</th><th>VALUE</th></tr></thead>
                <tbody>
                  <tr><td>Capacity</td><td><b>{battery.capacity} Ah @ {battery.voltage}V</b></td><td>Chemistry</td><td><span className={`badge ${battery.type === "LiFePO4" ? "badge-green" : "badge-amber"}`}>{battery.type}</span></td></tr>
                  <tr><td>Depth of Discharge (DoD)</td><td style={{ color: "#f59e0b" }}>{(battery.dod * 100).toFixed(0)}%</td><td>Cycle Life</td><td style={{ color: "#4ade80" }}>{battery.cycles} cycles</td></tr>
                  <tr><td>Usable Capacity</td><td>{(battery.capacity * battery.dod).toFixed(0)} Ah</td><td>Est. Market Price</td><td style={{ color: "#fcd34d" }}>{battery.price}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: SIZING ── */}
        {activeTab === "sizing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="grid4">
              <div className="metric-box">
                <div className="metric-val">{sizing.config.totalPanels}</div>
                <div className="metric-unit">×{panel.watt}W panels</div>
                <div className="metric-label">TOTAL PANELS</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{(sizing.config.totalWatts / 1000).toFixed(2)}</div>
                <div className="metric-unit">kWp</div>
                <div className="metric-label">ARRAY SIZE</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{sizing.totalBatteries}</div>
                <div className="metric-unit">× {battery.model.split("-").slice(-2).join(" ")}</div>
                <div className="metric-label">BATTERIES</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{(sizing.actualSystemWh / 1000).toFixed(2)}</div>
                <div className="metric-unit">kWh/day</div>
                <div className="metric-label">SYSTEM OUTPUT</div>
              </div>
            </div>

            {/* Panel Array */}
            <div className="card">
              <div className="section-title">🌞 SOLAR ARRAY CONFIGURATION</div>
              <div className="grid3" style={{ marginBottom: 16 }}>
                <div style={{ textAlign: "center", background: "#111a11", borderRadius: 6, padding: "12px" }}>
                  <div style={{ fontSize: 36, fontFamily: "'Bebas Neue', cursive", color: "#f59e0b" }}>{sizing.config.seriesPerString}</div>
                  <div style={{ fontSize: 10, color: "#6b9e6b", letterSpacing: "0.1em" }}>PANELS IN SERIES</div>
                  <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 4 }}>Per string (voltage match)</div>
                </div>
                <div style={{ textAlign: "center", background: "#111a11", borderRadius: 6, padding: "12px" }}>
                  <div style={{ fontSize: 36, fontFamily: "'Bebas Neue', cursive", color: "#60a5fa" }}>{sizing.config.parallelStrings}</div>
                  <div style={{ fontSize: 10, color: "#6b9e6b", letterSpacing: "0.1em" }}>PARALLEL STRINGS</div>
                  <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 4 }}>Current multiplication</div>
                </div>
                <div style={{ textAlign: "center", background: "#111a11", borderRadius: 6, padding: "12px" }}>
                  <div style={{ fontSize: 36, fontFamily: "'Bebas Neue', cursive", color: "#4ade80" }}>{sizing.config.totalPanels}</div>
                  <div style={{ fontSize: 10, color: "#6b9e6b", letterSpacing: "0.1em" }}>TOTAL PANELS</div>
                  <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 4 }}>{sizing.config.seriesPerString}S × {sizing.config.parallelStrings}P</div>
                </div>
              </div>
              <table>
                <thead><tr><th>ARRAY PARAMETER</th><th>VALUE</th><th>NOTES</th></tr></thead>
                <tbody>
                  <tr><td>Base Panel Power Required</td><td style={{ color: "#6b9e6b" }}>{sizing.basePanelWatts.toFixed(0)} W</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{audit.adjustedWh.toFixed(0)} Wh ÷ {psh} PSH</td></tr>
                  <tr><td>Surge Design Power <span className="badge badge-amber" style={{ fontSize: 9 }}>+20%</span></td><td style={{ color: "#fb923c", fontWeight: 700 }}>{sizing.totalPanelWatts.toFixed(0)} W</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{sizing.basePanelWatts.toFixed(0)} × 1.20 surge factor</td></tr>
                  <tr><td>String Open Circuit Voltage (Voc)</td><td style={{ color: "#f87171", fontWeight: 700 }}>{sizing.config.stringVoc.toFixed(1)} V</td><td style={{ fontSize: 10, color: "#6b9e6b" }}>Must be &lt; CC max PV voltage</td></tr>
                  <tr><td>String Max Power Voltage (Vmp)</td><td style={{ color: "#f59e0b", fontWeight: 700 }}>{sizing.config.stringVmp.toFixed(1)} V</td><td style={{ fontSize: 10, color: "#6b9e6b" }}>Operating voltage</td></tr>
                  <tr><td>Total Short Circuit Current (Isc)</td><td style={{ color: "#60a5fa", fontWeight: 700 }}>{sizing.config.totalIsc.toFixed(2)} A</td><td style={{ fontSize: 10, color: "#6b9e6b" }}>CC current ≥ {(sizing.config.totalIsc * 1.25).toFixed(1)}A (×1.25)</td></tr>
                  <tr><td>Total Max Power Current (Imp)</td><td style={{ color: "#4ade80", fontWeight: 700 }}>{sizing.config.totalImp.toFixed(2)} A</td><td style={{ fontSize: 10, color: "#6b9e6b" }}>Normal operating current</td></tr>
                  <tr><td>Total Array Power</td><td style={{ color: "#f59e0b", fontWeight: 700 }}>{sizing.config.totalWatts} Wp</td><td style={{ fontSize: 10, color: "#6b9e6b" }}>{sizing.config.totalPanels} × {panel.watt}W</td></tr>
                </tbody>
              </table>
            </div>

            {/* Charge Controller */}
            <div className="card">
              <div className="section-title">⚡ RECOMMENDED CHARGE CONTROLLERS</div>
              <div style={{ marginBottom: 10, fontSize: 11, color: "#6b9e6b" }}>
                Required: ≥{(sizing.config.totalIsc * 1.25).toFixed(1)}A @ {inverter.voltage}V — showing compatible MPPT controllers
              </div>
              {sizing.ccOptions.length === 0 ? (
                <div className="warn-box">⚠️ No single controller matches. Consider using multiple controllers or a custom MPPT unit.</div>
              ) : (
                <table>
                  <thead><tr><th>BRAND</th><th>MODEL</th><th>TYPE</th><th>MAX CURRENT</th><th>MAX PV V</th><th>VOLTAGES</th><th>PRICE</th><th>STATUS</th></tr></thead>
                  <tbody>
                    {sizing.ccOptions.slice(0, 6).map((cc, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: 10, color: "#6b9e6b" }}>{cc.brand}</td>
                        <td style={{ fontWeight: 700, color: "#d4f0d4" }}>{cc.model}</td>
                        <td><span className={`badge ${cc.type === "MPPT" ? "badge-green" : "badge-amber"}`}>{cc.type}</span></td>
                        <td style={{ color: "#f59e0b" }}>{cc.maxCurrent}A</td>
                        <td>{cc.maxPV ? cc.maxPV + "V" : "N/A"}</td>
                        <td style={{ fontSize: 10 }}>{cc.voltage.join("/")}V</td>
                        <td style={{ color: "#fcd34d" }}>{cc.price}</td>
                        <td><span className={`badge ${i === 0 ? "badge-green" : "badge-blue"}`}>{i === 0 ? "✓ BEST FIT" : "COMPATIBLE"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Battery Bank */}
            <div className="card">
              <div className="section-title">🔋 BATTERY BANK SIZING</div>
              <table>
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>FORMULA</th></tr></thead>
                <tbody>
                  <tr><td>Base Energy (after losses)</td><td style={{ color: "#6b9e6b" }}>{audit.adjustedWh.toFixed(0)} Wh</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{audit.totalWh.toFixed(0)} ÷ (1 − {systemLoss}%)</td></tr>
                  <tr><td>Surge Design Energy <span className="badge badge-amber" style={{ fontSize: 9 }}>+20%</span></td><td style={{ color: "#fb923c", fontWeight: 700 }}>{audit.surgeWh.toFixed(0)} Wh</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{audit.adjustedWh.toFixed(0)} × 1.20</td></tr>
                  <tr><td>Required Energy Storage</td><td style={{ color: "#f59e0b", fontWeight: 700 }}>{(audit.surgeWh * autonomyDays).toFixed(0)} Wh</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{audit.surgeWh.toFixed(0)} Wh × {autonomyDays} day(s)</td></tr>
                  <tr><td>Required Capacity @ {battery.voltage}V</td><td style={{ color: "#4ade80", fontWeight: 700 }}>{sizing.batteryCapacityAh.toFixed(0)} Ah</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>Wh ÷ {battery.voltage}V</td></tr>
                  <tr><td>Battery Units Needed</td><td style={{ color: "#f59e0b", fontWeight: 700 }}>{sizing.totalBatteries} units</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{sizing.batteriesInSeries}S × {sizing.parallelBatteryStrings}P config</td></tr>
                  <tr><td>Series (for {inverter.voltage}V system)</td><td>{sizing.batteriesInSeries} batteries</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>{inverter.voltage}V ÷ {battery.voltage}V</td></tr>
                  <tr><td>Parallel Strings</td><td>{sizing.parallelBatteryStrings} strings</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>Capacity multiplication</td></tr>
                  <tr><td>Total Bank Capacity</td><td style={{ color: "#60a5fa", fontWeight: 700 }}>{(sizing.totalBatteries * battery.capacity * battery.voltage / 1000).toFixed(1)} kWh</td><td style={{ fontSize: 10, color: "#4a7a4a" }}>Gross ({(sizing.totalBatteries * battery.capacity * battery.voltage * battery.dod / 1000).toFixed(1)} kWh usable)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: CONFIGURATIONS ── */}
        {activeTab === "configs" && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">🔢 ALL PANEL OPTIONS — SERIES/PARALLEL CONFIGURATIONS</div>
              <div style={{ marginBottom: 10, fontSize: 11, color: "#6b9e6b" }}>
                For {inverter.voltage}V inverter — surge design target: <b style={{ color: "#fb923c" }}>{sizing.totalPanelWatts.toFixed(0)}W</b> <span className="badge badge-amber" style={{ fontSize: 9 }}>+20% surge</span> (base: {sizing.basePanelWatts.toFixed(0)}W)
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>BRAND</th><th>MODEL</th><th>W/panel</th><th>SERIES</th><th>PARALLEL</th><th>TOTAL PANELS</th><th>ARRAY kWp</th><th>STRING Voc</th><th>TOTAL Isc</th><th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {altConfigs.map((c, i) => {
                      const isSelected = selectedPanel.brandIdx === c.bi && selectedPanel.modelIdx === c.mi;
                      return (
                        <tr key={i} style={{ background: isSelected ? "rgba(245,158,11,0.08)" : undefined }}>
                          <td style={{ fontSize: 10, color: "#6b9e6b" }}>{c.brand}</td>
                          <td style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? "#f59e0b" : "#d4f0d4" }}>{c.model} {isSelected && <span className="badge badge-amber">SELECTED</span>}</td>
                          <td>{c.watt}W</td>
                          <td style={{ color: "#f59e0b", fontWeight: 700, textAlign: "center" }}>{c.seriesPerString}</td>
                          <td style={{ color: "#60a5fa", fontWeight: 700, textAlign: "center" }}>{c.parallelStrings}</td>
                          <td style={{ color: "#4ade80", fontWeight: 700, textAlign: "center" }}>{c.totalPanels}</td>
                          <td>{(c.totalWatts / 1000).toFixed(2)} kWp</td>
                          <td style={{ color: c.stringVoc > 150 ? "#f87171" : "#4ade80" }}>{c.stringVoc.toFixed(1)}V</td>
                          <td>{c.totalIsc.toFixed(1)}A</td>
                          <td>
                            <button onClick={() => setSelectedPanel({ brandIdx: c.bi, modelIdx: c.mi })} style={{ background: isSelected ? "#f59e0b" : "transparent", border: `1px solid ${isSelected ? "#f59e0b" : "#2d4a2d"}`, color: isSelected ? "#0a0f0a" : "#6b9e6b", padding: "3px 10px", borderRadius: 3, fontSize: 10 }}>
                              {isSelected ? "✓ USING" : "SELECT"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Wiring Diagram */}
            <div className="card">
              <div className="section-title">🔌 SYSTEM WIRING DIAGRAM</div>
              <div style={{ background: "#080d08", borderRadius: 8, padding: 20, fontFamily: "monospace", fontSize: 11, color: "#4ade80", lineHeight: 1.8, overflowX: "auto" }}>
                <div style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 8, fontSize: 13 }}>// {sizing.config.seriesPerString}S × {sizing.config.parallelStrings}P Array → {inverter.voltage}V System</div>
                {Array.from({ length: sizing.config.parallelStrings }).map((_, pi) => (
                  <div key={pi} style={{ marginBottom: 4 }}>
                    <span style={{ color: "#6b9e6b" }}>String {pi + 1}: </span>
                    {Array.from({ length: sizing.config.seriesPerString }).map((_, si) => (
                      <span key={si}>
                        <span style={{ color: "#fcd34d", border: "1px solid #4a7a4a", padding: "1px 6px", borderRadius: 2, margin: "0 2px" }}>☀{panel.watt}W</span>
                        {si < sizing.config.seriesPerString - 1 && <span style={{ color: "#f59e0b" }}>─────</span>}
                      </span>
                    ))}
                    <span style={{ color: "#6b9e6b" }}> → {sizing.config.stringVmp.toFixed(1)}V / {panel.imp.toFixed(1)}A</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed #2d4a2d", marginTop: 8, paddingTop: 8, color: "#60a5fa" }}>
                  ↓ Combined: {sizing.config.stringVmp.toFixed(1)}V / {sizing.config.totalImp.toFixed(1)}A → [{sizing.ccOptions[0]?.model || "MPPT Controller"}] → [{inverter.voltage}V Battery Bank] → [{inverter.model}]
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SUMMARY ── */}
        {activeTab === "summary" && (
          <div>
            <div className="grid2" style={{ marginBottom: 20, gap: 16 }}>
              <div className="card">
                <div className="section-title" style={{ fontSize: 16 }}>📋 BILL OF MATERIALS</div>
                <table>
                  <thead><tr><th>COMPONENT</th><th>SPECIFICATION</th><th>QTY</th></tr></thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "#f59e0b" }}>Solar Panel</td>
                      <td>{PANEL_BRANDS[selectedPanel.brandIdx].brand}<br /><span style={{ fontSize: 10, color: "#6b9e6b" }}>{panel.model} | {panel.watt}W | Voc:{panel.voc}V | Isc:{panel.isc}A</span></td>
                      <td style={{ fontWeight: 700, color: "#4ade80", fontSize: 20 }}>{sizing.config.totalPanels}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#f59e0b" }}>Inverter</td>
                      <td>{INVERTER_BRANDS[selectedInverter.brandIdx].brand}<br /><span style={{ fontSize: 10, color: "#6b9e6b" }}>{inverter.model} | {inverter.kva}kVA | {inverter.voltage}V | {inverter.type}</span></td>
                      <td style={{ fontWeight: 700, color: "#4ade80", fontSize: 20 }}>1</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#f59e0b" }}>Charge Controller</td>
                      <td>{sizing.ccOptions[0] ? `${sizing.ccOptions[0].brand}` : "N/A"}<br /><span style={{ fontSize: 10, color: "#6b9e6b" }}>{sizing.ccOptions[0]?.model} | {sizing.ccOptions[0]?.type} | {sizing.ccOptions[0]?.maxCurrent}A</span></td>
                      <td style={{ fontWeight: 700, color: "#4ade80", fontSize: 20 }}>1</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#f59e0b" }}>Battery</td>
                      <td>{BATTERY_BANKS[selectedBattery.brandIdx].brand}<br /><span style={{ fontSize: 10, color: "#6b9e6b" }}>{battery.model} | {battery.capacity}Ah | {battery.voltage}V | {battery.type}</span></td>
                      <td style={{ fontWeight: 700, color: "#4ade80", fontSize: 20 }}>{sizing.totalBatteries}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="card">
                <div className="section-title" style={{ fontSize: 16 }}>✅ SYSTEM PERFORMANCE</div>
                <table>
                  <thead><tr><th>METRIC</th><th>VALUE</th><th>STATUS</th></tr></thead>
                  <tbody>
                    <tr>
                      <td>Daily Load</td><td style={{ color: "#f59e0b" }}>{(audit.totalWh / 1000).toFixed(2)} kWh</td>
                      <td><span className="badge badge-green">OK</span></td>
                    </tr>
                    <tr>
                      <td>System Daily Output</td><td style={{ color: "#4ade80" }}>{(sizing.actualSystemWh / 1000).toFixed(2)} kWh</td>
                      <td><span className={`badge ${sizing.actualSystemWh >= audit.totalWh ? "badge-green" : "badge-red"}`}>{sizing.actualSystemWh >= audit.totalWh ? "SUFFICIENT" : "DEFICIT"}</span></td>
                    </tr>
                    <tr>
                      <td>Inverter Adequacy</td><td>{inverter.watts}W vs {Math.ceil(audit.surgePeakW * 1.25)}W req. (surge)</td>
                      <td><span className={`badge ${inverter.watts >= audit.surgePeakW * 1.25 ? "badge-green" : "badge-red"}`}>{inverter.watts >= audit.surgePeakW * 1.25 ? "ADEQUATE" : "UNDERSIZED"}</span></td>
                    </tr>
                    <tr>
                      <td>Battery Autonomy</td><td>{autonomyDays} day(s)</td>
                      <td><span className="badge badge-blue">CONFIGURED</span></td>
                    </tr>
                    <tr>
                      <td>Array Config</td><td>{sizing.config.seriesPerString}S × {sizing.config.parallelStrings}P</td>
                      <td><span className="badge badge-green">✓ VALID</span></td>
                    </tr>
                    <tr>
                      <td>Peak Sun Hours</td><td>{psh} hrs/day ({location})</td>
                      <td><span className="badge badge-amber">LOCATION</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Design Notes */}
            <div className="card">
              <div className="section-title" style={{ fontSize: 16 }}>📌 ENGINEERING NOTES & RECOMMENDATIONS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
                <div className="ok-box">✓ <b>Panel Array:</b> {sizing.config.totalPanels} × {panel.watt}W panels arranged {sizing.config.seriesPerString}S × {sizing.config.parallelStrings}P. String Voc = {sizing.config.stringVoc.toFixed(1)}V. Ensure your MPPT controller's max PV input voltage exceeds this value.</div>
                <div className="ok-box">✓ <b>Charge Controller:</b> Minimum {(sizing.config.totalIsc * 1.25).toFixed(1)}A required (Isc × 1.25 NEC safety factor). MPPT recommended over PWM for efficiency gains of 15–30%.</div>
                <div className={sizing.ccOptions[0]?.maxPV && sizing.config.stringVoc > sizing.ccOptions[0]?.maxPV ? "warn-box" : "ok-box"}>
                  {sizing.ccOptions[0]?.maxPV && sizing.config.stringVoc > sizing.ccOptions[0]?.maxPV
                    ? `⚠️ String Voc (${sizing.config.stringVoc.toFixed(1)}V) EXCEEDS controller max PV voltage! Reduce series panels or choose higher-rated controller.`
                    : `✓ String Voc (${sizing.config.stringVoc.toFixed(1)}V) is within safe limits for selected controller.`}
                </div>
                <div className="ok-box">✓ <b>Battery Bank:</b> {sizing.totalBatteries} × {battery.model} in {sizing.batteriesInSeries}S/{sizing.parallelBatteryStrings}P configuration provides {(sizing.totalBatteries * battery.capacity * battery.voltage * battery.dod / 1000).toFixed(1)} kWh usable capacity.</div>
                <div className="ok-box">✓ <b>Surge Buffer (20%):</b> All sizing uses a ×1.20 surge factor — panel array target inflated from {sizing.basePanelWatts.toFixed(0)}W → {sizing.totalPanelWatts.toFixed(0)}W; inverter requirement from {Math.ceil(audit.peakW * 1.25)}W → {Math.ceil(audit.surgePeakW * 1.25)}W; battery storage from {(audit.adjustedWh * autonomyDays).toFixed(0)}Wh → {(audit.surgeWh * autonomyDays).toFixed(0)}Wh. This accounts for motor/compressor inrush and capacitive loads common in Nigerian households (pumps, fridges, ACs, fans).</div>
                <div className="warn-box">⚠️ <b>Cable Sizing:</b> Use appropriate DC cable gauge — string current {sizing.config.totalIsc.toFixed(1)}A requires minimum 6mm² DC cables. Use MC4 connectors rated for outdoor use.</div>
                <div className="ok-box">✓ <b>Safety:</b> Install DC fuses/breakers between each parallel string and at CC input/output. Install AC breaker on inverter output. Ground all metal frames.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1e3a1e", padding: "14px 24px", textAlign: "center", fontSize: 10, color: "#2d4a2d", letterSpacing: "0.1em" }}>
        NAIJA SOLAR SIZER — DESIGNED FOR NIGERIAN SOLAR INSTALLATIONS — VERIFY ALL SPECS WITH A CERTIFIED SOLAR ENGINEER
      </div>
    </div>
  );
}
