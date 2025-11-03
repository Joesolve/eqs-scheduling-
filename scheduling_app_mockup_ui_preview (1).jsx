import React, { useMemo, useState } from "react";

// Visual mockup of the Scheduling Command Center UI
// TailwindCSS classes are used for quick styling. This is a mock; wire the same layout in Power Apps.

const sampleData = [
  {
    id: 1,
    Date: "2026-01-12",
    AllDay: false,
    StartTime: "09:00",
    EndTime: "12:00",
    Type: "W",
    Status: "Confirmed",
    Source: "EQS",
    Client: "Telstra",
    Course: "Leadership Boost",
    Trainer: "Dom",
    Medium: "Online",
    Location: ["Syd"],
    Invoiced: false,
    Notes: "Zoom link in invite",
  },
  {
    id: 2,
    Date: "2026-01-17",
    AllDay: true,
    StartTime: "",
    EndTime: "",
    Type: "C",
    Status: "Tentative",
    Source: "CCE",
    Client: "UNICEF",
    Course: "Check-in",
    Trainer: "James",
    Medium: "F2F",
    Location: ["SG"],
    Invoiced: false,
    Notes: "Awaiting confirmation",
  },
  {
    id: 3,
    Date: "2026-01-25",
    AllDay: false,
    StartTime: "14:00",
    EndTime: "15:30",
    Type: "M",
    Status: "Offered",
    Source: "CTD",
    Client: "EQ Strategist",
    Course: "Coord Review",
    Trainer: "Sue",
    Medium: "F2F",
    Location: ["Mel"],
    Invoiced: true,
    Notes: "Boardroom 2",
  },
  {
    id: 4,
    Date: "2026-02-03",
    AllDay: false,
    StartTime: "10:00",
    EndTime: "13:00",
    Type: "W",
    Status: "Confirmed",
    Source: "EQS",
    Client: "ANZ",
    Course: "Agile Lab",
    Trainer: "Dom",
    Medium: "F2F",
    Location: ["Bne"],
    Invoiced: false,
    Notes: "Materials printed",
  },
];

const trainers = ["All", "Dom", "Sue", "James", "Kadi"];
const statuses = ["All", "Confirmed", "Offered", "Tentative"];
const sources = ["All", "EQS", "CCE", "CTD"];
const types = ["All", "W", "C", "M"];
const months = [
  { label: "All months", value: 0 },
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

function makeTitle(row) {
  if (row.Type === "W") {
    return `${row.Status}-${row.Source}-${row.Client} ${row.Course} (${row.Medium}) ${row.Trainer} ${row.Location.join(" ")}`;
  }
  if (row.Type === "C") {
    return `${row.Status}-${row.Source}-${row.Client} ${row.Course} ${row.Trainer}`;
  }
  return `${row.Status}-${row.Source}-${row.Client} ${row.Course} ${row.Trainer} ${row.Location.join(" ")}`;
}

function toCSV(rows) {
  const headers = [
    "Title",
    "Date",
    "AllDay",
    "StartTime",
    "EndTime",
    "Type",
    "Status",
    "Source",
    "Client",
    "Course",
    "Trainer",
    "Medium",
    "Location",
    "Invoiced",
    "Notes",
  ];
  const lines = [headers.join(",")];
  rows.forEach((r) => {
    const vals = [
      makeTitle(r),
      r.Date,
      r.AllDay ? "Yes" : "No",
      r.StartTime || "",
      r.EndTime || "",
      r.Type,
      r.Status,
      r.Source,
      r.Client,
      r.Course,
      r.Trainer,
      r.Medium,
      r.Location.join(";"),
      r.Invoiced ? "Yes" : "No",
      (r.Notes || "").replace(/\n/g, " "),
    ];
    lines.push(vals.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","));
  });
  return lines.join("\n");
}

export default function SchedulingMockup() {
  const [tab, setTab] = useState("search"); // "search" | "new" | "home"

  // Filters
  const [fTrainer, setFTrainer] = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [fSource, setFSource] = useState("All");
  const [fType, setFType] = useState("All");
  const [fMonth, setFMonth] = useState(0);

  const filtered = useMemo(() => {
    return sampleData.filter((r) => {
      const month = new Date(r.Date + "T00:00:00").getMonth() + 1;
      return (
        (fTrainer === "All" || r.Trainer === fTrainer) &&
        (fStatus === "All" || r.Status === fStatus) &&
        (fSource === "All" || r.Source === fSource) &&
        (fType === "All" || r.Type === fType) &&
        (fMonth === 0 || month === fMonth)
      );
    });
  }, [fTrainer, fStatus, fSource, fType, fMonth]);

  const download = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered-events.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Scheduling Command Center</h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-2xl border ${
                tab === "home" ? "bg-white shadow" : "bg-gray-100"
              }`}
              onClick={() => setTab("home")}
            >
              Home
            </button>
            <button
              className={`px-4 py-2 rounded-2xl border ${
                tab === "new" ? "bg-white shadow" : "bg-gray-100"
              }`}
              onClick={() => setTab("new")}
            >
              New Event
            </button>
            <button
              className={`px-4 py-2 rounded-2xl border ${
                tab === "search" ? "bg-white shadow" : "bg-gray-100"
              }`}
              onClick={() => setTab("search")}
            >
              Search & Export
            </button>
          </div>
        </header>

        {tab === "home" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-2">Quick Actions</h2>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => setTab("new")}>Add Event</button>
                <button className="px-3 py-2 rounded-xl bg-gray-900 text-white" onClick={() => setTab("search")}>Search & Export</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold mb-2">Common Views</h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Dom • Confirmed • January</li>
                <li>All Trainers • Tentative • This Month</li>
                <li>Source: EQS • Workshops</li>
              </ul>
            </div>
          </div>
        )}

        {tab === "new" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">New / Edit Event (mock)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Date</label>
                <input type="date" className="w-full mt-1 rounded-xl border p-2" />
              </div>
              <div>
                <label className="text-sm">All Day</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Start Time</label>
                <input type="time" className="w-full mt-1 rounded-xl border p-2" />
              </div>
              <div>
                <label className="text-sm">End Time</label>
                <input type="time" className="w-full mt-1 rounded-xl border p-2" />
              </div>
              <div>
                <label className="text-sm">Type</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  <option>W</option>
                  <option>C</option>
                  <option>M</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Status</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  <option>Confirmed</option>
                  <option>Offered</option>
                  <option>Tentative</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Source</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  <option>EQS</option>
                  <option>CCE</option>
                  <option>CTD</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Client</label>
                <input className="w-full mt-1 rounded-xl border p-2" placeholder="Client name" />
              </div>
              <div>
                <label className="text-sm">Course / Description</label>
                <input className="w-full mt-1 rounded-xl border p-2" placeholder="Course or description" />
              </div>
              <div>
                <label className="text-sm">Trainer</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  {trainers.filter(t => t !== "All").map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm">Medium</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  <option>F2F</option>
                  <option>Online</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Location</label>
                <select multiple className="w-full mt-1 rounded-xl border p-2 h-24">
                  {['Syd','Mel','Bne','SG','Msia'].map(l => (<option key={l}>{l}</option>))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Billing Notes</label>
                <textarea className="w-full mt-1 rounded-xl border p-2" rows={2} placeholder="Enter any billing notes" />
              </div>
              <div>
                <label className="text-sm">Invoiced</label>
                <select className="w-full mt-1 rounded-xl border p-2">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Notes</label>
                <textarea className="w-full mt-1 rounded-xl border p-2" rows={3} placeholder="Internal notes" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Save</button>
              <button className="px-4 py-2 rounded-xl bg-gray-200">Reset</button>
            </div>
          </div>
        )}

        {tab === "search" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Filters</h2>
              <div className="grid md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Trainer</label>
                  <select value={fTrainer} onChange={(e) => setFTrainer(e.target.value)} className="w-full mt-1 rounded-xl border p-2">
                    {trainers.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Status</label>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="w-full mt-1 rounded-xl border p-2">
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Source</label>
                  <select value={fSource} onChange={(e) => setFSource(e.target.value)} className="w-full mt-1 rounded-xl border p-2">
                    {sources.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Type</label>
                  <select value={fType} onChange={(e) => setFType(e.target.value)} className="w-full mt-1 rounded-xl border p-2">
                    {types.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Month</label>
                  <select value={fMonth} onChange={(e) => setFMonth(parseInt(e.target.value))} className="w-full mt-1 rounded-xl border p-2">
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-gray-900 text-white" onClick={download}>Export CSV</button>
                <button className="px-4 py-2 rounded-xl bg-gray-200" onClick={() => { setFTrainer("All"); setFStatus("All"); setFSource("All"); setFType("All"); setFMonth(0); }}>Reset Filters</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Results ({filtered.length})</h2>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Source</th>
                      <th className="py-2 pr-4">Trainer</th>
                      <th className="py-2 pr-4">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{makeTitle(r)}</td>
                        <td className="py-2 pr-4">{new Date(r.Date + "T00:00:00").toLocaleDateString()}</td>
                        <td className="py-2 pr-4">{r.AllDay ? "All day" : `${r.StartTime}–${r.EndTime}`}</td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-1 rounded-xl border text-xs">{r.Type}</span>
                        </td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-1 rounded-xl text-xs ${
                            r.Status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : r.Status === "Offered"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-sky-100 text-sky-800"
                          }`}>{r.Status}</span>
                        </td>
                        <td className="py-2 pr-4">{r.Source}</td>
                        <td className="py-2 pr-4">{r.Trainer}</td>
                        <td className="py-2 pr-4">{r.Location.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
