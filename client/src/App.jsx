import { useEffect, useState } from 'react';

const stats = ['Total buses', 'Total drivers', 'Total students', 'Active allocations'];

const emptyBus = { busNumber: '', registrationNumber: '', capacity: '', status: 'available' };
const emptyDriver = { name: '', licenseNumber: '', phone: '', email: '', status: 'available' };

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('Signing in...');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to sign in');
      localStorage.setItem('transport_token', data.token);
      onLogin(data.user);
    } catch (error) { setMessage(error.message); }
  }

  return <main className="auth-page"><section className="auth-card">
    <p className="eyebrow">College transport</p><h1>Sign in</h1>
    <p className="muted">Access your transport management dashboard.</p>
    <form onSubmit={handleSubmit} className="form-stack">
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      <button type="submit">Sign in</button>
    </form>
    {message && <p className="status-message">{message}</p>}
  </section></main>;
}

function AdminDashboard({ user, onLogout }) {
  const [buses, setBuses] = useState([]);
  const [busForm, setBusForm] = useState(emptyBus);
  const [editingId, setEditingId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [driverForm, setDriverForm] = useState(emptyDriver);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [driverMessage, setDriverMessage] = useState('');
  const [busMessage, setBusMessage] = useState('');

  async function loadBuses() {
    const token = localStorage.getItem('transport_token');
    const response = await fetch('http://localhost:5000/api/buses', { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Unable to load buses');
    setBuses(data.buses);
  }

  async function handleBusSubmit(event) {
    event.preventDefault();
    setBusMessage('Saving bus...');
    try {
      const token = localStorage.getItem('transport_token');
      const response = await fetch(`http://localhost:5000/api/buses${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(busForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save bus');
      setBuses((current) => (editingId ? current.map((bus) => (bus._id === editingId ? data.bus : bus)) : [...current, data.bus]).sort((a, b) => a.busNumber.localeCompare(b.busNumber)));
      setBusForm(emptyBus);
      setEditingId(null);
      setBusMessage(editingId ? 'Bus updated successfully.' : 'Bus added successfully.');
    } catch (error) { setBusMessage(error.message); }
  }

  async function handleBusDelete(id) {
    if (!window.confirm('Delete this bus?')) return;
    const token = localStorage.getItem('transport_token');
    const response = await fetch(`http://localhost:5000/api/buses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) { setBusMessage(data.message || 'Unable to delete bus'); return; }
    setBuses((current) => current.filter((bus) => bus._id !== id));
  }

  async function loadDrivers() {
    const token = localStorage.getItem('transport_token');
    const response = await fetch('http://localhost:5000/api/drivers', { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Unable to load drivers');
    setDrivers(data.drivers);
  }

  async function handleDriverSubmit(event) {
    event.preventDefault();
    setDriverMessage('Saving driver...');
    try {
      const token = localStorage.getItem('transport_token');
      const response = await fetch(`http://localhost:5000/api/drivers${editingDriverId ? `/${editingDriverId}` : ''}`, {
        method: editingDriverId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(driverForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save driver');
      setDrivers((current) => (editingDriverId ? current.map((driver) => (driver._id === editingDriverId ? data.driver : driver)) : [...current, data.driver]).sort((a, b) => a.name.localeCompare(b.name)));
      setDriverForm(emptyDriver);
      setEditingDriverId(null);
      setDriverMessage(editingDriverId ? 'Driver updated successfully.' : 'Driver added successfully.');
    } catch (error) { setDriverMessage(error.message); }
  }

  async function handleDriverDelete(id) {
    if (!window.confirm('Delete this driver?')) return;
    const token = localStorage.getItem('transport_token');
    const response = await fetch(`http://localhost:5000/api/drivers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) { setDriverMessage(data.message || 'Unable to delete driver'); return; }
    setDrivers((current) => current.filter((driver) => driver._id !== id));
  }

  function startEditingDriver(driver) {
    setEditingDriverId(driver._id);
    setDriverForm({ name: driver.name, licenseNumber: driver.licenseNumber, phone: driver.phone, email: driver.email, status: driver.status });
    setDriverMessage('Editing driver.');
  }

  function startEditing(bus) {
    setEditingId(bus._id);
    setBusForm({ busNumber: bus.busNumber, registrationNumber: bus.registrationNumber, capacity: bus.capacity, status: bus.status });
    setBusMessage('Editing bus.');
  }

  useEffect(() => {
    loadBuses().catch((error) => setBusMessage(error.message));
    loadDrivers().catch((error) => setDriverMessage(error.message));
  }, []);

  return <main className="dashboard-page">
    <header className="topbar"><div><p className="eyebrow">Admin workspace</p><h1>Transport dashboard</h1></div>
      <div className="topbar-actions"><span>{user.name}</span><button className="secondary-button" onClick={onLogout}>Sign out</button></div>
    </header>
    <section className="welcome-panel"><div><p className="eyebrow">Overview</p><h2>Good to see you, {user.name}.</h2><p className="muted">Manage the college transport system from one place.</p></div><span className="role-badge">Administrator</span></section>
    <section className="stats-grid" aria-label="Transport statistics">{stats.map((label) => <article className="stat-card" key={label}><p className="muted">{label}</p><strong>0</strong><small>Records will appear here</small></article>)}</section>
    <section className="bus-section">
      <div><p className="eyebrow">Transport records</p><h2>Bus management</h2></div>
      <form className="bus-form" onSubmit={handleBusSubmit}>
        <input placeholder="Bus number" value={busForm.busNumber} onChange={(event) => setBusForm({ ...busForm, busNumber: event.target.value })} required />
        <input placeholder="Registration number" value={busForm.registrationNumber} onChange={(event) => setBusForm({ ...busForm, registrationNumber: event.target.value })} required />
        <input type="number" min="1" placeholder="Capacity" value={busForm.capacity} onChange={(event) => setBusForm({ ...busForm, capacity: event.target.value })} required />
        <select value={busForm.status} onChange={(event) => setBusForm({ ...busForm, status: event.target.value })}><option value="available">Available</option><option value="active">Active</option><option value="maintenance">Maintenance</option></select>
        <button type="submit">{editingId ? 'Update bus' : 'Add bus'}</button>
        {editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setBusForm(emptyBus); }}>Cancel</button>}
      </form>
      {busMessage && <p className="status-message">{busMessage}</p>}
      <div className="table-wrap"><table><thead><tr><th>Bus number</th><th>Registration</th><th>Capacity</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {buses.map((bus) => <tr key={bus._id}><td>{bus.busNumber}</td><td>{bus.registrationNumber}</td><td>{bus.capacity}</td><td>{bus.status}</td><td><button className="secondary-button" onClick={() => startEditing(bus)}>Edit</button> <button className="danger-button" onClick={() => handleBusDelete(bus._id)}>Delete</button></td></tr>)}
        {!buses.length && <tr><td colSpan="5" className="empty-cell">No buses have been added yet.</td></tr>}
      </tbody></table></div>
    </section>
    <section className="bus-section">
      <div><p className="eyebrow">People records</p><h2>Driver management</h2></div>
      <form className="bus-form driver-form" onSubmit={handleDriverSubmit}>
        <input placeholder="Full name" value={driverForm.name} onChange={(event) => setDriverForm({ ...driverForm, name: event.target.value })} required />
        <input placeholder="License number" value={driverForm.licenseNumber} onChange={(event) => setDriverForm({ ...driverForm, licenseNumber: event.target.value })} required />
        <input placeholder="Phone" value={driverForm.phone} onChange={(event) => setDriverForm({ ...driverForm, phone: event.target.value })} required />
        <input type="email" placeholder="Email" value={driverForm.email} onChange={(event) => setDriverForm({ ...driverForm, email: event.target.value })} required />
        <select value={driverForm.status} onChange={(event) => setDriverForm({ ...driverForm, status: event.target.value })}><option value="available">Available</option><option value="assigned">Assigned</option><option value="inactive">Inactive</option></select>
        <button type="submit">{editingDriverId ? 'Update driver' : 'Add driver'}</button>
        {editingDriverId && <button type="button" className="secondary-button" onClick={() => { setEditingDriverId(null); setDriverForm(emptyDriver); }}>Cancel</button>}
      </form>
      {driverMessage && <p className="status-message">{driverMessage}</p>}
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>License</th><th>Phone</th><th>Email</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {drivers.map((driver) => <tr key={driver._id}><td>{driver.name}</td><td>{driver.licenseNumber}</td><td>{driver.phone}</td><td>{driver.email}</td><td>{driver.status}</td><td><button className="secondary-button" onClick={() => startEditingDriver(driver)}>Edit</button> <button className="danger-button" onClick={() => handleDriverDelete(driver._id)}>Delete</button></td></tr>)}
        {!drivers.length && <tr><td colSpan="6" className="empty-cell">No drivers have been added yet.</td></tr>}
      </tbody></table></div>
    </section>
  </main>;
}

export default function App() {
  const [user, setUser] = useState(null);
  function handleLogout() { localStorage.removeItem('transport_token'); setUser(null); }
  if (!user) return <Login onLogin={setUser} />;
  if (user.role !== 'admin') return <Login onLogin={setUser} />;
  return <AdminDashboard user={user} onLogout={handleLogout} />;
}
