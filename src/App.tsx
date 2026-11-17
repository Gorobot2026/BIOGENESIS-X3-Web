import { useEffect, useMemo, useRef, useState } from "react";

type Route = "home" | "mixer" | "dashboard" | "setup";
type Layer = {
  id: number;
  name: string;
  crop: string;
  icon: string;
  temp: number;
  humidity: number;
  soil: number;
  light: number;
};
type Settings = Record<
  number,
  {
    auto: boolean;
    targetTemp: number;
    minSoil: number;
    waterSeconds: number;
    fan: boolean;
    led: boolean;
    lightHours: number;
  }
>;

const crops = [
  {
    id: "strawberry",
    name: "สตรอว์เบอร์รี",
    en: "Strawberry",
    icon: "🍓",
    tint: "#fff0ef",
    ratio: [40, 25, 25, 10],
  },
  {
    id: "lettuce",
    name: "ผักสลัด",
    en: "Lettuce",
    icon: "🥬",
    tint: "#effbf0",
    ratio: [45, 30, 20, 5],
  },
  {
    id: "tomato",
    name: "มะเขือเทศ",
    en: "Tomato",
    icon: "🍅",
    tint: "#fff2e9",
    ratio: [40, 30, 25, 5],
  },
  {
    id: "basil",
    name: "โหระพา",
    en: "Sweet Basil",
    icon: "🌿",
    tint: "#ebfaf5",
    ratio: [50, 25, 20, 5],
  },
  { id: "chili", name: "พริก", en: "Chili", icon: "🌶️", tint: "#ffefef", ratio: [45, 25, 25, 5] },
  {
    id: "cucumber",
    name: "แตงกวา",
    en: "Cucumber",
    icon: "🥒",
    tint: "#f3fae9",
    ratio: [45, 25, 25, 5],
  },
  {
    id: "carrot",
    name: "แครอท",
    en: "Carrot",
    icon: "🥕",
    tint: "#fff6e8",
    ratio: [55, 25, 15, 5],
  },
  {
    id: "flowers",
    name: "ไม้ดอก",
    en: "Flowers",
    icon: "🌸",
    tint: "#f9efff",
    ratio: [45, 30, 20, 5],
  },
];
const materials = [
  ["ดินปลูก", "Base Soil", "#ad7b54"],
  ["ปุ๋ยหมัก", "Compost", "#4d966f"],
  ["ขุยมะพร้าว", "Coco Coir", "#d8af76"],
  ["ไบโอชาร์", "Biochar", "#3f5266"],
];
const initialLayers: Layer[] = [
  {
    id: 1,
    name: "ชั้นที่ 1",
    crop: "ผักสลัด / Lettuce",
    icon: "🥬",
    temp: 25.8,
    humidity: 72,
    soil: 64,
    light: 880,
  },
  {
    id: 2,
    name: "ชั้นที่ 2",
    crop: "สตรอว์เบอร์รี / Strawberry",
    icon: "🍓",
    temp: 23.6,
    humidity: 68,
    soil: 59,
    light: 760,
  },
  {
    id: 3,
    name: "ชั้นที่ 3",
    crop: "สมุนไพร / Herbs",
    icon: "🌿",
    temp: 26.1,
    humidity: 70,
    soil: 61,
    light: 820,
  },
];
const defaultSettings: Settings = {
  1: {
    auto: true,
    targetTemp: 25,
    minSoil: 45,
    waterSeconds: 8,
    fan: true,
    led: true,
    lightHours: 12,
  },
  2: {
    auto: true,
    targetTemp: 24,
    minSoil: 48,
    waterSeconds: 8,
    fan: true,
    led: true,
    lightHours: 11,
  },
  3: {
    auto: true,
    targetTemp: 26,
    minSoil: 43,
    waterSeconds: 6,
    fan: true,
    led: true,
    lightHours: 12,
  },
};

const titles: Record<Route, string> = {
  home: "Overview",
  mixer: "Smart Soil Mixer",
  dashboard: "IoT Dashboard",
  setup: "3-Layer Setup",
};

function PageHead({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {action ?? <span className="tag orange">● การสาธิตระบบ</span>}
    </div>
  );
}

function SectionHead({
  title,
  desc,
  right,
}: {
  title: string;
  desc: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      {right}
    </div>
  );
}

function Home({ go, openLab }: { go: (r: Route) => void; openLab: () => void }) {
  const workflow = [
    ["♻️", "01 Biochar", "วัสดุเหลือใช้จากเกษตร"],
    ["⚙️", "02 Soil Mixer", "ผสมสูตรวัสดุปลูก"],
    ["🌰", "03 Seed Capsule", "เตรียมแคปซูลเมล็ด"],
    ["🏡", "04 Greenhouse", "ควบคุมโรงเรือน"],
    ["📈", "05 AI Learning", "วิเคราะห์ผลการทดลอง"],
  ];
  return (
    <>
      <PageHead
        eyebrow="CIRCULAR ENERGY SMART AGRICULTURE"
        title="เกษตรอัจฉริยะ BIOGENESIS X3"
        desc="เปลี่ยนแนวคิดการเกษตรเป็นการเรียนรู้ผ่านหุ่นยนต์ ข้อมูล และระบบ IoT"
      />
      <section className="hero">
        <div className="hero-mark">GO ROBOT · FLL INNOVATION</div>
        <div className="hero-content">
          <span className="hero-chip">✦ LEARN • BUILD • EXPERIMENT</span>
          <h2>
            Grow Smarter.
            <br />
            <span>Grow Greener.</span>
          </h2>
          <p>
            สร้างอนาคตเกษตรอัจฉริยะด้วยการแปรรูปวัสดุเหลือใช้ ผสมดินตามสูตรพืช และควบคุมโรงเรือน 3 ชั้น
            พร้อมเรียนรู้จากข้อมูลเซนเซอร์จริงในอนาคต
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => go("mixer")}>
              🌱 เริ่มเลือกสูตรผสมดิน <b>→</b>
            </button>
            <button className="btn glass" onClick={() => go("dashboard")}>
              📊 ดู Dashboard
            </button>
          </div>
        </div>
      </section>
      <div className="summary-grid">
        {[
          ["⚙️", "โมดูลนวัตกรรม", "5 Modules", "mint"],
          ["🏡", "โรงเรือนอัจฉริยะ", "3 Layers", "sky"],
          ["🌿", "พืชตัวอย่าง", "8 Crops", "lilac"],
          ["📡", "โหมดของเว็บไซต์", "Simulation", "peach"],
        ].map(([icon, label, value, color]) => (
          <div className="summary" key={value}>
            <span className={`summary-icon ${color}`}>{icon}</span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="home-panels">
        <section className="card card-pad">
          <SectionHead title="เส้นทางนวัตกรรม 5 โมดูล" desc="BIOGENESIS X3 Circular Workflow" />
          <div className="workflow">
            {workflow.map(([icon, title, sub], i) => (
              <div className="stage" key={title}>
                <span>{icon}</span>
                <b>{title}</b>
                <small>{sub}</small>
                {i < 4 && <i>›</i>}
              </div>
            ))}
          </div>
          <div className="notice info">
            💡{" "}
            <span>
              ตอนนี้เว็บใช้ข้อมูลสาธิต ยังไม่เชื่อมอุปกรณ์จริง เด็กสามารถทดลองกดปุ่มและศึกษาการไหลของข้อมูลได้อย่างปลอดภัย
            </span>
          </div>
        </section>
        <section className="card card-pad">
          <SectionHead title="สำรวจระบบ" desc="เลือกโมดูลเพื่อดูรายละเอียดและทดลอง" />
          <div className="module-grid">
            {[
              ["🌱", "Smart Soil Mixer", "เลือกพืชและผสมวัสดุ", () => go("mixer")],
              ["📊", "IoT Dashboard", "ดูค่าเซนเซอร์ 3 ชั้น", () => go("dashboard")],
              ["⚙️", "Greenhouse Setup", "ตั้งค่าอุปกรณ์โรงเรือน", () => go("setup")],
              ["🧪", "Experiment Lab", "แนวคิดการเรียนรู้สูตรดิน", openLab],
            ].map(([icon, title, sub, fn]) => (
              <button onClick={fn as () => void} key={title as string}>
                <span>{icon as string}</span>
                <div>
                  <b>{title as string}</b>
                  <small>{sub as string}</small>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Mixer({ toast }: { toast: (text: string) => void }) {
  const [cropId, setCropId] = useState("strawberry");
  const [weight, setWeight] = useState(1000);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);
  const crop = crops.find((c) => c.id === cropId) ?? crops[0];
  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );
  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setStatus("idle");
    setProgress(0);
  };
  const start = () => {
    if (timer.current) clearInterval(timer.current);
    if (status === "done") setProgress(0);
    setStatus("running");
    timer.current = window.setInterval(
      () =>
        setProgress((p) => {
          const next = Math.min(100, p + 2);
          if (next === 100) {
            if (timer.current) clearInterval(timer.current);
            timer.current = null;
            setStatus("done");
            toast("การผสมดินจำลองเสร็จสิ้น — ไม่ได้สั่งอุปกรณ์จริง");
          }
          return next;
        }),
      160,
    );
  };
  const pause = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setStatus("paused");
    toast("หยุดการจำลองไว้ชั่วคราว");
  };
  const statusLabel = { idle: "รอคำสั่ง", running: "กำลังจำลอง", paused: "หยุดชั่วคราว", done: "เสร็จสิ้น" }[
    status
  ];
  const description =
    status === "idle"
      ? "เลือกพืชและกดเริ่ม เพื่อจำลองการทำงานของเครื่องผสมดิน"
      : status === "paused"
        ? "การจำลองหยุดชั่วคราว กดเริ่มเพื่อทำต่อ"
        : status === "done"
          ? "จำลองการผสมสำเร็จแล้ว (ไม่ได้ควบคุมอุปกรณ์จริง)"
          : progress < 28
            ? "กำลังจำลองการจ่ายดินปลูก..."
            : progress < 52
              ? "กำลังจำลองการจ่ายปุ๋ยหมัก..."
              : progress < 75
                ? "กำลังจำลองการจ่ายขุยมะพร้าวและไบโอชาร์..."
                : "กำลังจำลองมอเตอร์ผสมให้เข้ากัน...";
  return (
    <>
      <PageHead
        eyebrow="MODULE 02 — SMART SOIL MIXER"
        title="เครื่องผสมดินอัจฉริยะ"
        desc="เลือกชนิดพืช กำหนดน้ำหนัก แล้วทดลองส่งคำสั่งผสมตามสัดส่วนที่กำหนด"
        action={<span className="tag orange">● คำสั่งจำลองเท่านั้น</span>}
      />
      <div className="mixer-layout">
        <section className="card card-pad">
          <SectionHead
            title="เลือกชนิดพืช"
            desc="เลือกรูปพืชเพื่อดูสูตรผสมดินตัวอย่าง"
            right={<span className="tag blue">8 Plant Library</span>}
          />
          <div className="crop-grid">
            {crops.map((c) => (
              <button
                className={`crop ${cropId === c.id ? "selected" : ""}`}
                onClick={() => {
                  setCropId(c.id);
                  reset();
                }}
                key={c.id}
              >
                <div className="crop-img" style={{ background: c.tint }}>
                  {c.icon}
                </div>
                <i>✓</i>
                <b>{c.name}</b>
                <small>{c.en}</small>
              </button>
            ))}
          </div>
          <div className="notice">
            ⚠️{" "}
            <span>
              สูตรที่แสดงเป็น <b>ข้อมูลสมมติสำหรับฝึกเขียนโปรแกรม</b> ไม่ใช่คำแนะนำสัดส่วนปลูกที่ผ่านการทดสอบ
              ควรทดลองจริงและปรับตามผลวัดดินก่อนนำไปใช้งาน
            </span>
          </div>
        </section>
        <section className="card card-pad mix-control">
          <SectionHead
            title="⚙️ ตั้งค่าการผสม"
            desc="Recipe & Mixing Control"
            right={<span className="demo-badge">DEMO</span>}
          />
          <label>ชนิดพืชที่เลือก</label>
          <div className="chosen">
            <span>{crop.icon}</span>
            <div>
              <b>{crop.name}</b>
              <small>{crop.en} · ตัวอย่างสูตร</small>
            </div>
          </div>
          <label>น้ำหนักวัสดุรวม</label>
          <div className="segments">
            {[500, 1000, 2000, 3000].map((n) => (
              <button
                className={weight === n ? "active" : ""}
                onClick={() => {
                  setWeight(n);
                  reset();
                }}
                key={n}
              >
                {n.toLocaleString()} g
              </button>
            ))}
          </div>
          <label>สัดส่วนวัสดุปลูก · {weight.toLocaleString()} กรัม</label>
          <div className="formula">
            {materials.map((m, i) => (
              <div key={m[0]}>
                <p>
                  <span>
                    <i style={{ background: m[2] }} />
                    {m[0]} <small>{m[1]}</small>
                  </span>
                  <b>
                    {crop.ratio[i]}% · {((weight * crop.ratio[i]) / 100).toLocaleString()} g
                  </b>
                </p>
                <div>
                  <i style={{ width: `${crop.ratio[i]}%`, background: m[2] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mix-state">
            <div>
              <b>สถานะการทำงาน</b>
              <span
                className={`tag ${status === "running" ? "blue" : status === "idle" ? "gray" : ""}`}
              >
                {statusLabel}
              </span>
            </div>
            <div className="progress">
              <i style={{ width: `${progress}%` }} />
            </div>
            <p>{description}</p>
            <div className="mix-actions">
              <button className="btn primary" onClick={start} disabled={status === "running"}>
                ▶ ทดลองเริ่มผสม
              </button>
              <button className="btn outline" onClick={pause} disabled={status !== "running"}>
                Ⅱ หยุดชั่วคราว
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  reset();
                  toast("รีเซ็ตการจำลองแล้ว");
                }}
              >
                ↺ รีเซ็ต
              </button>
            </div>
          </div>
          <div className="simulation">
            🔒 ระบบนี้ไม่ส่งคำสั่งไปมอเตอร์ เซอร์โว หรือปั๊มจริง ต้องพัฒนา Backend ที่ยืนยันสิทธิ์และระบบหยุดฉุกเฉินก่อนเชื่อม
            ESP32
          </div>
        </section>
      </div>
    </>
  );
}

function LineChart() {
  return (
    <svg viewBox="0 0 730 250" preserveAspectRatio="none" aria-label="กราฟสาธิตค่าเซนเซอร์">
      {[35, 75, 115, 155, 195].map((y) => (
        <line key={y} x1="50" x2="695" y1={y} y2={y} />
      ))}
      <path
        className="area"
        d="M50 201 L84 195 118 188 152 191 186 176 220 169 254 173 288 155 322 146 356 155 390 137 424 133 458 145 492 129 526 117 560 121 594 113 628 105 662 97 690 108 L690 215 L50 215Z"
      />
      <polyline
        className="line-one"
        points="50,201 84,195 118,188 152,191 186,176 220,169 254,173 288,155 322,146 356,155 390,137 424,133 458,145 492,129 526,117 560,121 594,113 628,105 662,97 690,108"
      />
      <polyline
        className="line-two"
        points="50,154 84,162 118,143 152,151 186,135 220,154 254,166 288,146 322,142 356,146 390,135 424,127 458,131 492,119 526,135 560,123 594,119 628,131 662,123 690,107"
      />
      {["00:00", "06:00", "12:00", "18:00", "24:00"].map((x, i) => (
        <text key={x} x={48 + i * 151} y="238">
          {x}
        </text>
      ))}
    </svg>
  );
}

function Dashboard({
  layers,
  setLayers,
  settings,
  layerId,
  setLayerId,
  toast,
}: {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  settings: Settings;
  layerId: number;
  setLayerId: (id: number) => void;
  toast: (t: string) => void;
}) {
  const layer = layers.find((l) => l.id === layerId) ?? layers[0];
  const refresh = () => {
    setLayers((ls) =>
      ls.map((l, i) => ({
        ...l,
        temp: +(l.temp + ((i + 1) * 0.1 - 0.2)).toFixed(1),
        humidity: l.humidity + (i === 1 ? 1 : -1),
        soil: l.soil + (i === 2 ? 1 : -1),
      })),
    );
    toast("รีเฟรชข้อมูลสาธิตแล้ว — ไม่ได้อ่าน ESP32");
  };
  const sensors = [
    ["🌡️", "อุณหภูมิ", layer.temp.toFixed(1), "°C"],
    ["💧", "ความชื้นอากาศ", layer.humidity, "%RH"],
    ["🌱", "ความชื้นวัสดุปลูก", layer.soil, "%"],
    ["☀️", "ความเข้มแสง", layer.light.toLocaleString(), "lx"],
  ];
  return (
    <>
      <PageHead
        eyebrow="MODULE 04 + 05 — REAL-TIME MONITORING"
        title="IoT Smart Greenhouse Dashboard"
        desc="แสดงข้อมูลโรงเรือน 3 ชั้น โดยเลือกชั้นเพื่อดูค่าเซนเซอร์และสถานะการทำงาน"
        action={
          <button className="btn outline small" onClick={refresh}>
            ↻ รีเฟรชข้อมูลจำลอง
          </button>
        }
      />
      <div className="dash-banner">
        <div>
          <span>● 3-LAYER SMART GREENHOUSE</span>
          <h2>ติดตามสภาพแวดล้อมได้ในหน้าเดียว</h2>
          <p>ค่าเซนเซอร์ทั้งหมดเป็นข้อมูลจำลอง เพื่อใช้ทดสอบหน้าจอและการเขียนโปรแกรม</p>
        </div>
        <b>📡 OFFLINE DEMO DATA</b>
      </div>
      <div className="layer-tabs">
        {layers.map((l) => (
          <button
            className={layerId === l.id ? "active" : ""}
            onClick={() => setLayerId(l.id)}
            key={l.id}
          >
            <span>{l.icon}</span>
            <div>
              <b>{l.name}</b>
              <small>{l.crop}</small>
            </div>
            <i>{layerId === l.id ? "✓" : ""}</i>
          </button>
        ))}
      </div>
      <div className="sensor-grid">
        {sensors.map(([icon, label, value, unit]) => (
          <div className="card sensor" key={label as string}>
            <div>
              <span>{label}</span>
              <i>{icon}</i>
            </div>
            <strong>
              {value}
              <small>{unit}</small>
            </strong>
            <p>
              ↗ ค่าตัวอย่าง <b>DEMO</b>
            </p>
          </div>
        ))}
      </div>
      <div className="dashboard-lower">
        <section className="card card-pad">
          <SectionHead
            title="แนวโน้มค่าเซนเซอร์"
            desc="กราฟสาธิตอุณหภูมิและความชื้นตลอด 24 ชั่วโมง"
            right={
              <div className="legend">
                <span>Temperature</span>
                <span>Humidity</span>
              </div>
            }
          />
          <div className="chart">
            <LineChart />
          </div>
          <small className="muted">กราฟนี้เป็นข้อมูลตัวอย่าง ไม่ใช่ค่าจากเซนเซอร์หรือการบันทึกจริง</small>
        </section>
        <section className="card card-pad">
          <SectionHead
            title={`สถานะอุปกรณ์ ชั้นที่ ${layer.id}`}
            desc="สถานะจำลองจากการตั้งค่าหน้า Setup"
            right={<span className="tag blue">System status</span>}
          />
          <div className="device-list">
            {[
              ["💦", "ระบบให้น้ำ", "โหมดอัตโนมัติ", settings[layerId].auto],
              ["🌀", "พัดลมระบายอากาศ", "Fan Control", settings[layerId].fan],
              ["💡", "ไฟปลูกพืช", "Grow Light", settings[layerId].led],
              ["📶", "ESP32 / IoT", "ยังไม่เชื่อมอุปกรณ์จริง", false],
            ].map(([icon, name, sub, on]) => (
              <div key={name as string}>
                <span>{icon as string}</span>
                <p>
                  <b>{name as string}</b>
                  <small>{sub as string}</small>
                </p>
                <i className={on ? "" : "off"}>{on ? "จำลอง: เปิด" : "ไม่ทำงาน"}</i>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Setup({
  layers,
  layerId,
  setLayerId,
  settings,
  setSettings,
  toast,
}: {
  layers: Layer[];
  layerId: number;
  setLayerId: (id: number) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  toast: (t: string) => void;
}) {
  const layer = layers.find((l) => l.id === layerId) ?? layers[0];
  const cfg = settings[layerId];
  const update = (key: keyof typeof cfg, value: number | boolean) =>
    setSettings((s) => ({ ...s, [layerId]: { ...s[layerId], [key]: value } }));
  const ranges: [string, string, keyof typeof cfg, number, number, string][] = [
    ["🌡️", "อุณหภูมิเป้าหมาย", "targetTemp", 18, 34, "°C"],
    ["💧", "ความชื้นวัสดุปลูกขั้นต่ำ", "minSoil", 20, 80, "%"],
    ["🚿", "ระยะเวลาให้น้ำต่อรอบ", "waterSeconds", 2, 15, "วินาที"],
    ["☀️", "เวลาเปิดไฟปลูกพืช", "lightHours", 6, 18, "ชม./วัน"],
  ];
  const save = () => {
    localStorage.setItem("biogenesis_settings", JSON.stringify(settings));
    toast("บันทึกค่าจำลองบนเบราว์เซอร์เรียบร้อยแล้ว");
  };
  return (
    <>
      <PageHead
        eyebrow="MODULE 04 — ENVIRONMENT CONTROL"
        title="ตั้งค่าระบบโรงเรือนอัจฉริยะ"
        desc="แยกการตั้งค่าสำหรับพืชแต่ละชั้น และจำลองเงื่อนไขการควบคุมอุปกรณ์"
        action={<span className="tag orange">● ตั้งค่าเฉพาะในเบราว์เซอร์</span>}
      />
      <div className="setup-layout">
        <aside className="setup-layers">
          {layers.map((l) => (
            <button
              className={l.id === layerId ? "active" : ""}
              onClick={() => setLayerId(l.id)}
              key={l.id}
            >
              <span>{l.icon}</span>
              <div>
                <b>{l.name}</b>
                <small>{l.crop}</small>
              </div>
            </button>
          ))}
          <div className="notice info">
            🔐 <span>ค่าที่ตั้งอยู่ใน Local Storage ของเบราว์เซอร์นี้ ยังไม่ได้ส่งถึง Google Sheets หรือ ESP32</span>
          </div>
        </aside>
        <div className="setup-panel">
          <div className="setup-intro">
            <span>{layer.icon}</span>
            <div>
              <h3>Environment Settings — {layer.name}</h3>
              <p>{layer.crop} · ปรับแต่งค่าตัวอย่างเพื่อเรียนรู้วิธีควบคุมโรงเรือน</p>
            </div>
          </div>
          <section className="card card-pad">
            <SectionHead
              title="ตั้งค่าตามสภาพแวดล้อม"
              desc="ปรับค่าเป้าหมายเพื่อจำลองการรักษาสภาพแวดล้อมของพืช"
            />
            <div className="settings-grid">
              {ranges.map(([icon, label, key, min, max, unit]) => (
                <div className="setting" key={key}>
                  <h4>
                    {icon} {label}
                  </h4>
                  <strong>
                    {String(cfg[key])}
                    <small> {unit}</small>
                  </strong>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={Number(cfg[key])}
                    onChange={(e) => update(key, Number(e.target.value))}
                  />
                  <p>
                    <span>
                      {min} {unit}
                    </span>
                    <span>
                      {max} {unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="card card-pad">
            <SectionHead title="ระบบอัตโนมัติและอุปกรณ์" desc="เปิด-ปิดสถานะจำลอง โดยไม่ได้ควบคุมอุปกรณ์จริง" />
            <div className="toggle-list">
              {[
                ["💦", "ให้น้ำอัตโนมัติ", "Auto Irrigation — Demo", "auto"],
                ["🌀", "เปิดพัดลม", "Ventilation Fan — Demo", "fan"],
                ["💡", "เปิด Grow LED", "Plant Grow Lights — Demo", "led"],
              ].map(([icon, label, sub, key]) => (
                <label key={key}>
                  <div>
                    <b>
                      {icon} {label}
                    </b>
                    <small>{sub}</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(cfg[key as keyof typeof cfg])}
                    onChange={(e) => update(key as keyof typeof cfg, e.target.checked)}
                  />
                  <i />
                </label>
              ))}
            </div>
          </section>
          <div className="setup-actions">
            <span>⚠️ ยังไม่ได้เชื่อมอุปกรณ์ IoT จริง</span>
            <div>
              <button
                className="btn outline"
                onClick={() => {
                  setSettings((s) => ({ ...s, [layerId]: { ...defaultSettings[layerId] } }));
                  toast("คืนค่าตั้งต้นเฉพาะชั้นนี้แล้ว");
                }}
              >
                ↺ ค่าเริ่มต้น
              </button>
              <button className="btn primary" onClick={save}>
                💾 บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const hashRoute = location.hash.slice(1) as Route;
  const [route, setRoute] = useState<Route>(titles[hashRoute] ? hashRoute : "home");
  const [menu, setMenu] = useState(false);
  const [layers, setLayers] = useState(initialLayers);
  const [layerId, setLayerId] = useState(1);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      return JSON.parse(localStorage.getItem("biogenesis_settings") || "") || defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [toastText, setToastText] = useState("");
  const [lab, setLab] = useState(false);
  const date = useMemo(
    () =>
      new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(),
      ),
    [],
  );
  const toast = (text: string) => {
    setToastText(text);
    window.setTimeout(() => setToastText(""), 3500);
  };
  const go = (r: Route) => {
    setRoute(r);
    location.hash = r;
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const change = () => {
      const r = location.hash.slice(1) as Route;
      if (titles[r]) {
        setRoute(r);
        setMenu(false);
      }
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <div className="brand">
          <div className="emblem">
            <span>G</span>
            <i />
          </div>
          <div>
            <b>
              BIOGENESIS <em>X3</em>
            </b>
            <small>GOROBOT · SMART FARM</small>
          </div>
        </div>
        <p className="side-label">WORKSPACE</p>
        <nav>
          {(
            [
              ["home", "⌂", "หน้าแรก"],
              ["mixer", "⚛", "Smart Soil Mixer"],
              ["dashboard", "▥", "IoT Dashboard"],
              ["setup", "⚙", "Setup โรงเรือน"],
            ] as [Route, string, string][]
          ).map(([r, icon, label]) => (
            <button className={route === r ? "active" : ""} onClick={() => go(r)} key={r}>
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="grow-card">
          <span>🌱</span>
          <b>Grow Smart, Grow Green</b>
          <p>เรียนรู้เทคโนโลยีผ่านการปลูกพืชและการทดลองจริง</p>
        </div>
        <div className="side-bottom">
          <i /> ระบบสาธิต · Demo Mode <span>v1.0</span>
        </div>
      </aside>
      {menu && <button className="overlay" aria-label="ปิดเมนู" onClick={() => setMenu(false)} />}
      <div className="main-column">
        <header className="topbar">
          <div>
            <button className="menu" onClick={() => setMenu(!menu)}>
              ☰
            </button>
            <span>BIOGENESIS X3</span>
            <i>/</i>
            <b>{titles[route]}</b>
          </div>
          <div>
            <span className="demo-env">● DEMO ENVIRONMENT</span>
            <time>{date}</time>
            <b className="avatar">GO</b>
          </div>
        </header>
        <main>
          {route === "home" && <Home go={go} openLab={() => setLab(true)} />}
          {route === "mixer" && <Mixer toast={toast} />}
          {route === "dashboard" && (
            <Dashboard
              layers={layers}
              setLayers={setLayers}
              settings={settings}
              layerId={layerId}
              setLayerId={setLayerId}
              toast={toast}
            />
          )}
          {route === "setup" && (
            <Setup
              layers={layers}
              layerId={layerId}
              setLayerId={setLayerId}
              settings={settings}
              setSettings={setSettings}
              toast={toast}
            />
          )}
        </main>
        <footer>
          BIOGENESIS X3 — Circular Energy Smart Agriculture{" "}
          <span>Designed for young innovators · Go Robot</span>
        </footer>
      </div>
      {toastText && <div className="toast">{toastText}</div>}
      {lab && (
        <div className="modal-cover" onClick={() => setLab(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🧪 Experiment Lab</h3>
            <p>
              โมดูลในอนาคตสำหรับเปรียบเทียบสูตร Biochar ที่ทดลองจริง ได้แก่ อัตราการงอก ความสูงต้น และการใช้น้ำ
              เมื่อต่อกับ Google Sheets จึงจะแสดงผลการทดลองจริง
            </p>
            <button className="btn primary" onClick={() => setLab(false)}>
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
