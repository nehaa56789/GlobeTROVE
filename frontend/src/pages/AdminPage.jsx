import { useState, useEffect, useCallback } from "react";
import { adminAPI, paymentAPI } from "../utils/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (p) => `₹${(p / 100).toLocaleString("en-IN")}`;
const badge = (label, color) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: "999px", padding: "2px 10px", fontSize: "0.75rem", fontWeight: 600,
  }}>{label}</span>
);

const statusColor = { Confirmed: "#22c55e", Pending: "#f59e0b", Cancelled: "#ef4444", Completed: "#6366f1" };
const payColor = { paid: "#22c55e", pending: "#f59e0b", failed: "#ef4444", refunded: "#a78bfa" };

// ─── Small UI atoms ───────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", small, disabled }) => {
  const base = {
    padding: small ? "4px 12px" : "8px 18px",
    borderRadius: "8px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontSize: small ? "0.78rem" : "0.9rem", fontWeight: 600, transition: "opacity .15s",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: "#6366f1", color: "#fff" },
    danger: { background: "#ef4444", color: "#fff" },
    success: { background: "#22c55e", color: "#fff" },
    ghost: { background: "#1e293b", color: "#94a3b8", border: "1px solid #334155" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Input = ({ label, value, onChange, type = "text", options }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ display: "block", color: "#94a3b8", fontSize: "0.8rem", marginBottom: 4 }}>{label}</label>
    {options ? (
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", background: "#0f172a", color: "#f1f5f9", border: "1px solid #334155", borderRadius: 8, fontSize: "0.9rem" }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", background: "#0f172a", color: "#f1f5f9", border: "1px solid #334155", borderRadius: 8, fontSize: "0.9rem", boxSizing: "border-box" }} />
    )}
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: "#0f172a", border: `1px solid #1e293b`, borderRadius: "1rem",
    padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem",
  }}>
    <div style={{ fontSize: "2rem", background: color + "22", padding: "0.7rem", borderRadius: "0.75rem" }}>{icon}</div>
    <div>
      <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ color: "#f1f5f9", fontSize: "1.6rem", fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────
const Modal = ({ title, children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "2rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ color: "#f1f5f9", margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Users", "Bookings", "Destinations", "Flights", "Hotels"];

export default function AdminPage({ theme, showToast, setPage, user }) {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // { type, data }

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== "admin") {
      showToast("Admin access required", "error");
      setPage("home");
    }
  }, [user, setPage, showToast]);

  // Fetch data
  const fetchStats = useCallback(async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch { showToast("Failed to load stats", "error"); }
  }, [showToast]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const r = await adminAPI.getUsers(); setUsers(r.data.data); }
    catch { showToast("Failed to load users", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try { const r = await adminAPI.getBookings(); setBookings(r.data.data); }
    catch { showToast("Failed to load bookings", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const { destinationsAPI } = await import("../utils/api");
      const r = await destinationsAPI.getAll();
      setDestinations(r.data.data);
    } catch { showToast("Failed to load destinations", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    try {
      const { flightsAPI } = await import("../utils/api");
      const r = await flightsAPI.getAll();
      setFlights(r.data.data);
    } catch { showToast("Failed to load flights", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const { hotelsAPI } = await import("../utils/api");
      const r = await hotelsAPI.getAll();
      setHotels(r.data.data);
    } catch { showToast("Failed to load hotels", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => {
    if (tab === "Overview") fetchStats();
    if (tab === "Users") fetchUsers();
    if (tab === "Bookings") fetchBookings();
    if (tab === "Destinations") fetchDestinations();
    if (tab === "Flights") fetchFlights();
    if (tab === "Hotels") fetchHotels();
  }, [tab, fetchStats, fetchUsers, fetchBookings, fetchDestinations, fetchFlights, fetchHotels]);

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const deleteUser = async (id) => {
    if (!confirm("Delete this user and all their bookings?")) return;
    try {
      await adminAPI.deleteUser(id);
      showToast("User deleted", "success");
      fetchUsers();
    } catch { showToast("Delete failed", "error"); }
  };

  const toggleUserRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      await adminAPI.updateUser(u._id, { role: newRole });
      showToast(`${u.name} is now ${newRole}`, "success");
      fetchUsers();
    } catch { showToast("Update failed", "error"); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await adminAPI.updateBooking(id, { status });
      showToast("Booking updated", "success");
      fetchBookings();
    } catch { showToast("Update failed", "error"); }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking permanently?")) return;
    try {
      await adminAPI.deleteBooking(id);
      showToast("Booking deleted", "success");
      fetchBookings();
    } catch { showToast("Delete failed", "error"); }
  };

  const refundBooking = async (id) => {
    if (!confirm("Initiate full refund for this booking?")) return;
    try {
      await paymentAPI.refund(id);
      showToast("Refund initiated", "success");
      fetchBookings();
    } catch { showToast("Refund failed", "error"); }
  };

  const deleteDestination = async (id) => {
    if (!confirm("Delete this destination?")) return;
    try {
      await adminAPI.deleteDestination(id);
      showToast("Destination deleted", "success");
      fetchDestinations();
    } catch { showToast("Delete failed", "error"); }
  };

  const deleteFlight = async (id) => {
    if (!confirm("Delete this flight?")) return;
    try {
      await adminAPI.deleteFlight(id);
      showToast("Flight deleted", "success");
      fetchFlights();
    } catch { showToast("Delete failed", "error"); }
  };

  const deleteHotel = async (id) => {
    if (!confirm("Delete this hotel?")) return;
    try {
      await adminAPI.deleteHotel(id);
      showToast("Hotel deleted", "success");
      fetchHotels();
    } catch { showToast("Delete failed", "error"); }
  };

  // ─── Form modals ─────────────────────────────────────────────────────────────
  const DestForm = ({ existing }) => {
    const [form, setForm] = useState(existing || { city: "", country: "", desc: "", price: "", rating: "", img: "", tag: "Tropical", isPopular: false });
    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
    const submit = async () => {
      const payload = { ...form, price: Number(form.price), rating: Number(form.rating) };
      try {
        if (existing) await adminAPI.updateDestination(existing._id, payload);
        else await adminAPI.createDestination(payload);
        showToast(existing ? "Destination updated" : "Destination created", "success");
        setModal(null);
        fetchDestinations();
      } catch (e) { showToast(e.response?.data?.message || "Error", "error"); }
    };
    return (
      <>
        <Input label="City" value={form.city} onChange={set("city")} />
        <Input label="Country" value={form.country} onChange={set("country")} />
        <Input label="Description" value={form.desc} onChange={set("desc")} />
        <Input label="Price (paise, e.g. 108000 = ₹1,080)" value={form.price} onChange={set("price")} type="number" />
        <Input label="Rating (0–5)" value={form.rating} onChange={set("rating")} type="number" />
        <Input label="Image URL" value={form.img} onChange={set("img")} />
        <Input label="Tag" value={form.tag} onChange={set("tag")} options={["Romantic","Tropical","Culture","Scenic","Luxury","Adventure","Exotic"]} />
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Btn onClick={submit} variant="primary">{existing ? "Update" : "Create"}</Btn>
          <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
        </div>
      </>
    );
  };

  const FlightForm = ({ existing }) => {
    const [form, setForm] = useState(existing || { from: "", to: "", airline: "", dep: "", arr: "", dur: "", price: "", stops: 0, class: "Economy" });
    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
    const submit = async () => {
      const payload = { ...form, price: Number(form.price), stops: Number(form.stops) };
      try {
        if (existing) await adminAPI.updateFlight(existing._id, payload);
        else await adminAPI.createFlight(payload);
        showToast(existing ? "Flight updated" : "Flight created", "success");
        setModal(null);
        fetchFlights();
      } catch (e) { showToast(e.response?.data?.message || "Error", "error"); }
    };
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Input label="From" value={form.from} onChange={set("from")} />
          <Input label="To" value={form.to} onChange={set("to")} />
          <Input label="Airline" value={form.airline} onChange={set("airline")} />
          <Input label="Class" value={form.class} onChange={set("class")} options={["Economy","Business","First"]} />
          <Input label="Departure" value={form.dep} onChange={set("dep")} />
          <Input label="Arrival" value={form.arr} onChange={set("arr")} />
          <Input label="Duration" value={form.dur} onChange={set("dur")} />
          <Input label="Stops" value={form.stops} onChange={set("stops")} type="number" />
        </div>
        <Input label="Price (paise)" value={form.price} onChange={set("price")} type="number" />
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Btn onClick={submit} variant="primary">{existing ? "Update" : "Create"}</Btn>
          <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
        </div>
      </>
    );
  };

  const HotelForm = ({ existing }) => {
    const [form, setForm] = useState(existing || { name: "", city: "", stars: 4, price: "", rating: "", img: "", amenities: "" });
    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
    const submit = async () => {
      const payload = { ...form, price: Number(form.price), rating: Number(form.rating), stars: Number(form.stars), amenities: typeof form.amenities === "string" ? form.amenities.split(",").map((s) => s.trim()) : form.amenities };
      try {
        if (existing) await adminAPI.updateHotel(existing._id, payload);
        else await adminAPI.createHotel(payload);
        showToast(existing ? "Hotel updated" : "Hotel created", "success");
        setModal(null);
        fetchHotels();
      } catch (e) { showToast(e.response?.data?.message || "Error", "error"); }
    };
    return (
      <>
        <Input label="Hotel Name" value={form.name} onChange={set("name")} />
        <Input label="City" value={form.city} onChange={set("city")} />
        <Input label="Stars (1–5)" value={form.stars} onChange={set("stars")} type="number" />
        <Input label="Price per night (paise)" value={form.price} onChange={set("price")} type="number" />
        <Input label="Rating (0–10)" value={form.rating} onChange={set("rating")} type="number" />
        <Input label="Image URL" value={form.img} onChange={set("img")} />
        <Input label="Amenities (comma separated)" value={Array.isArray(form.amenities) ? form.amenities.join(", ") : form.amenities} onChange={set("amenities")} />
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Btn onClick={submit} variant="primary">{existing ? "Update" : "Create"}</Btn>
          <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
        </div>
      </>
    );
  };

  // ─── Layout ──────────────────────────────────────────────────────────────────
  const wrap = { minHeight: "100vh", background: "#050a14", color: "#f1f5f9", padding: "2rem" };
  const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" };
  const tabBar = { display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" };
  const tabBtn = (t) => ({
    padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
    background: tab === t ? "#6366f1" : "#0f172a",
    color: tab === t ? "#fff" : "#64748b",
    fontWeight: 600, fontSize: "0.9rem",
    border: `1px solid ${tab === t ? "#6366f1" : "#1e293b"}`,
  });
  const table = { width: "100%", borderCollapse: "collapse" };
  const th = { color: "#64748b", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1, padding: "10px 12px", borderBottom: "1px solid #1e293b", textAlign: "left" };
  const td = { padding: "12px", borderBottom: "1px solid #0f172a", fontSize: "0.88rem", color: "#cbd5e1" };
  const sectionHead = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" };

  if (!user || user.role !== "admin") return null;

  return (
    <div style={wrap}>
      {/* Header */}
      <div style={header}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>🛡️ Admin Dashboard</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9rem" }}>GlobeTrove Control Panel</p>
        </div>
        <Btn onClick={() => setPage("home")} variant="ghost">← Back to Site</Btn>
      </div>

      {/* Tabs */}
      <div style={tabBar}>
        {TABS.map((t) => <button key={t} style={tabBtn(t)} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "Overview" && stats && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <StatCard icon="👤" label="Users" value={stats.totalUsers} color="#6366f1" />
            <StatCard icon="🎫" label="Bookings" value={stats.totalBookings} color="#22c55e" />
            <StatCard icon="💰" label="Revenue" value={fmt(stats.totalRevenue)} color="#f59e0b" />
            <StatCard icon="🏝️" label="Destinations" value={stats.totalDestinations} color="#06b6d4" />
            <StatCard icon="✈️" label="Flights" value={stats.totalFlights} color="#a78bfa" />
            <StatCard icon="🏨" label="Hotels" value={stats.totalHotels} color="#f472b6" />
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem", color: "#f1f5f9" }}>Recent Bookings</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead><tr>
                  <th style={th}>User</th><th style={th}>Type</th><th style={th}>Destination</th>
                  <th style={th}>Amount</th><th style={th}>Status</th><th style={th}>Payment</th>
                </tr></thead>
                <tbody>
                  {stats.recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={td}>{b.userId?.name || "—"}<br /><span style={{ color: "#475569", fontSize: "0.75rem" }}>{b.userId?.email}</span></td>
                      <td style={td}>{b.type}</td>
                      <td style={td}>{b.dest}</td>
                      <td style={td}>{fmt(b.price)}</td>
                      <td style={td}>{badge(b.status, statusColor[b.status] || "#64748b")}</td>
                      <td style={td}>{badge(b.paymentStatus, payColor[b.paymentStatus] || "#64748b")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── USERS ── */}
      {tab === "Users" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={sectionHead}><h3 style={{ margin: 0, color: "#f1f5f9" }}>All Users ({users.length})</h3></div>
          {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead><tr>
                  <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Role</th>
                  <th style={th}>Joined</th><th style={th}>Actions</th>
                </tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={td}>{u.name}</td>
                      <td style={td}>{u.email}</td>
                      <td style={td}>{badge(u.role, u.role === "admin" ? "#6366f1" : "#64748b")}</td>
                      <td style={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn small onClick={() => toggleUserRole(u)} variant="ghost">
                            {u.role === "admin" ? "→ User" : "→ Admin"}
                          </Btn>
                          {u._id !== user.id && (
                            <Btn small onClick={() => deleteUser(u._id)} variant="danger">Delete</Btn>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {tab === "Bookings" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={sectionHead}><h3 style={{ margin: 0, color: "#f1f5f9" }}>All Bookings ({bookings.length})</h3></div>
          {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead><tr>
                  <th style={th}>User</th><th style={th}>Type</th><th style={th}>Dest</th>
                  <th style={th}>Amount</th><th style={th}>Status</th><th style={th}>Payment</th><th style={th}>Actions</th>
                </tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td style={td}>{b.userId?.name || "—"}</td>
                      <td style={td}>{b.type}</td>
                      <td style={td}>{b.dest}</td>
                      <td style={td}>{fmt(b.price)}</td>
                      <td style={td}>{badge(b.status, statusColor[b.status] || "#64748b")}</td>
                      <td style={td}>{badge(b.paymentStatus, payColor[b.paymentStatus] || "#64748b")}</td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {b.status !== "Confirmed" && <Btn small onClick={() => updateBookingStatus(b._id, "Confirmed")} variant="success">Confirm</Btn>}
                          {b.status !== "Cancelled" && <Btn small onClick={() => updateBookingStatus(b._id, "Cancelled")} variant="danger">Cancel</Btn>}
                          {b.paymentStatus === "paid" && <Btn small onClick={() => refundBooking(b._id)} variant="ghost">Refund</Btn>}
                          <Btn small onClick={() => deleteBooking(b._id)} variant="danger">Del</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── DESTINATIONS ── */}
      {tab === "Destinations" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={sectionHead}>
            <h3 style={{ margin: 0, color: "#f1f5f9" }}>Destinations ({destinations.length})</h3>
            <Btn onClick={() => setModal({ type: "dest" })} variant="primary">+ Add Destination</Btn>
          </div>
          {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1rem" }}>
              {destinations.map((d) => (
                <div key={d._id} style={{ background: "#050a14", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid #1e293b" }}>
                  <img src={d.img} alt={d.city} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                  <div style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "#f1f5f9" }}>{d.city}, {d.country}</div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem", margin: "4px 0" }}>{badge(d.tag, "#6366f1")} &nbsp; ⭐ {d.rating} &nbsp; {fmt(d.price)}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: "0.75rem" }}>
                      <Btn small onClick={() => setModal({ type: "dest", data: d })} variant="ghost">Edit</Btn>
                      <Btn small onClick={() => deleteDestination(d._id)} variant="danger">Delete</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── FLIGHTS ── */}
      {tab === "Flights" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={sectionHead}>
            <h3 style={{ margin: 0, color: "#f1f5f9" }}>Flights ({flights.length})</h3>
            <Btn onClick={() => setModal({ type: "flight" })} variant="primary">+ Add Flight</Btn>
          </div>
          {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead><tr>
                  <th style={th}>Route</th><th style={th}>Airline</th><th style={th}>Class</th>
                  <th style={th}>Duration</th><th style={th}>Stops</th><th style={th}>Price</th><th style={th}>Actions</th>
                </tr></thead>
                <tbody>
                  {flights.map((f) => (
                    <tr key={f._id}>
                      <td style={td}>{f.from} → {f.to}</td>
                      <td style={td}>{f.airline}</td>
                      <td style={td}>{f.class}</td>
                      <td style={td}>{f.dur}</td>
                      <td style={td}>{f.stops === 0 ? "Direct" : f.stops}</td>
                      <td style={td}>{fmt(f.price)}</td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn small onClick={() => setModal({ type: "flight", data: f })} variant="ghost">Edit</Btn>
                          <Btn small onClick={() => deleteFlight(f._id)} variant="danger">Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── HOTELS ── */}
      {tab === "Hotels" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={sectionHead}>
            <h3 style={{ margin: 0, color: "#f1f5f9" }}>Hotels ({hotels.length})</h3>
            <Btn onClick={() => setModal({ type: "hotel" })} variant="primary">+ Add Hotel</Btn>
          </div>
          {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead><tr>
                  <th style={th}>Name</th><th style={th}>City</th><th style={th}>Stars</th>
                  <th style={th}>Rating</th><th style={th}>Price/Night</th><th style={th}>Actions</th>
                </tr></thead>
                <tbody>
                  {hotels.map((h) => (
                    <tr key={h._id}>
                      <td style={td}>{h.name}</td>
                      <td style={td}>{h.city}</td>
                      <td style={td}>{"⭐".repeat(h.stars)}</td>
                      <td style={td}>{h.rating}/10</td>
                      <td style={td}>{fmt(h.price)}</td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn small onClick={() => setModal({ type: "hotel", data: h })} variant="ghost">Edit</Btn>
                          <Btn small onClick={() => deleteHotel(h._id)} variant="danger">Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {modal?.type === "dest" && (
        <Modal title={modal.data ? "Edit Destination" : "Add Destination"} onClose={() => setModal(null)}>
          <DestForm existing={modal.data} />
        </Modal>
      )}
      {modal?.type === "flight" && (
        <Modal title={modal.data ? "Edit Flight" : "Add Flight"} onClose={() => setModal(null)}>
          <FlightForm existing={modal.data} />
        </Modal>
      )}
      {modal?.type === "hotel" && (
        <Modal title={modal.data ? "Edit Hotel" : "Add Hotel"} onClose={() => setModal(null)}>
          <HotelForm existing={modal.data} />
        </Modal>
      )}
    </div>
  );
}
