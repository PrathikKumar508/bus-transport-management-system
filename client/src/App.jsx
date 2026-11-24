import { useEffect, useState } from 'react';

const stats = ['Total buses', 'Total drivers', 'Total students', 'Active allocations'];
const emptyBus = { busNumber: '', registrationNumber: '', capacity: '', status: 'available' };
const emptyDriver = { name: '', licenseNumber: '', phone: '', email: '', status: 'available' };

function ArrowUpRight() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8" /></svg>;
}

function BusMark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>;
}

function Landing({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotlightX, setSpotlightX] = useState(null);
  const [activeNav, setActiveNav] = useState(0);

  useEffect(() => {
    const sectionIndexes = [
      { id: 'about', index: 1 },
      { id: 'roles', index: 2 },
      { id: 'how-it-works', index: 3 },
    ];

    function updateActiveSection() {
      if (window.scrollY < 260) {
        setActiveNav(0);
        return;
      }

      const marker = window.scrollY + window.innerHeight * 0.35;
      let currentIndex = 0;
      sectionIndexes.forEach(({ id, index }) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= marker) currentIndex = index;
      });
      setActiveNav(currentIndex);
    }

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  return <div className="landing-page">
    <nav className="landing-nav spotlight-nav" aria-label="Main navigation" style={{ '--spotlight-x': spotlightX === null ? '50%' : `${spotlightX}px` }} onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setSpotlightX(event.clientX - rect.left); }} onMouseLeave={() => setSpotlightX(null)}>
      <span className="nav-spotlight" aria-hidden="true" />
      <button className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <BusMark /><span>CTMS</span>
      </button>
      <button className="mobile-menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        <button className={activeNav === 0 ? 'nav-active' : ''} onClick={() => { setActiveNav(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
        <button className={activeNav === 1 ? 'nav-active' : ''} onClick={() => { setActiveNav(1); scrollToSection('about'); }}>About</button>
        <button className={activeNav === 2 ? 'nav-active' : ''} onClick={() => { setActiveNav(2); scrollToSection('roles'); }}>Features</button>
        <button className={activeNav === 3 ? 'nav-active' : ''} onClick={() => { setActiveNav(3); scrollToSection('how-it-works'); }}>How it works</button>
        <button className="nav-login" onClick={onLogin}>Login <ArrowUpRight /></button>
      </div>
    </nav>

    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="kicker"><span className="kicker-dot" /> College bus transport management</p>
          <h1>College transportation.<br /><em>Simplified.</em></h1>
          <p className="hero-description">One centralized platform to manage college transportation for administrators, students and drivers.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onLogin}>Get started <ArrowUpRight /></button>
            <button className="text-button" onClick={() => scrollToSection('roles')}>Explore features <span>↓</span></button>
          </div>
        </div>
        <div className="hero-visual" aria-label="Connected college transport overview">
          <div className="visual-glow" />
          <div className="route-line route-line-one" />
          <div className="route-line route-line-two" />
          <div className="route-node node-one"><span className="node-icon">◈</span><small>Routes</small></div>
          <div className="route-node node-two"><span className="node-icon">●</span><small>Students</small></div>
          <div className="route-node node-three"><span className="node-icon">▰</span><small>Buses</small></div>
          <div className="visual-core"><BusMark /><strong>CTMS</strong><span>Connected transport</span></div>
          <p className="visual-caption">One system. Every journey.</p>
        </div>
        <div className="hero-footnote"><span>01</span><span>Centralized operations</span><span className="footnote-line" /><span>Scroll to explore</span></div>
      </section>

      <section className="intro-strip" id="about">
        <div className="about-visual" aria-hidden="true">
          <div className="about-orbit orbit-one" />
          <div className="about-orbit orbit-two" />
          <div className="about-orbit orbit-three" />
          <div className="about-center"><BusMark /><span>CTMS</span></div>
          <div className="about-spark spark-one" />
          <div className="about-spark spark-two" />
          <div className="about-spark spark-three" />
          <div className="about-visual-caption">One connected workspace</div>
        </div>
        <div className="about-copy">
          <p className="section-label">/ About CTMS</p>
          <h2>Transport operations, <span>made clearer.</span></h2>
          <p>CTMS brings the essential parts of college transportation into one dependable workspace—helping teams stay organized while keeping transport information easy to access.</p>
          <div className="about-benefits">
            <div><span className="benefit-number">01</span><div><h3>Centralized Management</h3><p>Keep core transport records together and easy to manage.</p></div></div>
            <div><span className="benefit-number">02</span><div><h3>Organized Scheduling</h3><p>Give every assignment a clear place in the daily operation.</p></div></div>
            <div><span className="benefit-number">03</span><div><h3>Role-Based Access</h3><p>Show each user the information relevant to their role.</p></div></div>
          </div>
        </div>
      </section>

      <section className="roles-section" id="roles">
        <div className="section-heading"><div><p className="section-label">/ Built for every journey</p><h2>One platform.<br /><span>Three perspectives.</span></h2></div><p>Designed around the people who keep college transportation moving.</p></div>
        <div className="role-grid">
          <RoleCard number="01" title="Admin" accent="admin" description="Manage the complete transport operation from one central dashboard." items={['Buses and drivers', 'Routes and stops', 'Schedules and allocations']} />
          <RoleCard number="02" title="Student" accent="student" description="Find the transport details that matter to your college day." items={['Allocated bus', 'Route and stop information', 'Personal schedule']} />
          <RoleCard number="03" title="Driver" accent="driver" description="See every assignment clearly before heading out on the road." items={['Assigned bus details', 'Routes and stops', 'Trip schedules']} />
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-heading"><div><p className="section-label">/ How it works</p><h2>From planning<br /><span>to the road.</span></h2></div><p>A simple flow that keeps everyone informed and every allocation accountable.</p></div>
        <div className="steps-grid"><Step number="01" title="Admin sets the system" text="The administrator manages buses, drivers, routes, stops and schedules." /><Step number="02" title="Students get allocated" text="Students are registered and assigned to the right bus, route and stop." /><Step number="03" title="Everyone stays informed" text="Students and drivers log in to view the transport information relevant to them." /></div>
      </section>
    </main>

    <footer className="landing-footer"><div className="footer-brand"><BusMark /><strong>CTMS</strong><p>Clearer transport management<br />for every college journey.</p></div><div className="footer-links"><div><span>Explore</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button><button onClick={() => scrollToSection('about')}>About</button><button onClick={() => scrollToSection('roles')}>Features</button></div><div><span>Access</span><button onClick={onLogin}>Login</button><button onClick={() => scrollToSection('how-it-works')}>How it works</button></div></div><div className="footer-bottom"><span>College project attribution placeholder</span><span>© 2025 CTMS. Built for better journeys.</span></div></footer>
  </div>;
}

function RoleCard({ number, title, accent, description, items }) {
  return <article className={`role-card role-${accent}`}><div className="card-top"><span>{number}</span><ArrowUpRight /></div><div className="role-icon">{accent === 'admin' ? '⌘' : accent === 'student' ? '◌' : '↗'}</div><h3>{title}</h3><p>{description}</p><ul>{items.map((item) => <li key={item}><span>+</span>{item}</li>)}</ul></article>;
}

function Step({ number, title, text }) {
  return <article className="step-card"><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight /></article>;
}

function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('Signing in...');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to sign in');
      localStorage.setItem('transport_token', data.token);
      onLogin(data.user);
    } catch (error) { setMessage(error.message); }
  }

  return <main className="auth-page"><button className="back-button" onClick={onBack}>← Back to home</button><section className="auth-card"><p className="eyebrow">College transport</p><h1>Sign in</h1><p className="muted">Access your transport management dashboard.</p><form onSubmit={handleSubmit} className="form-stack"><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button type="submit">Sign in</button></form>{message && <p className="status-message">{message}</p>}</section></main>;
}

function AdminDashboard({ user, onLogout }) {
  const [buses, setBuses] = useState([]); const [busForm, setBusForm] = useState(emptyBus); const [editingId, setEditingId] = useState(null); const [drivers, setDrivers] = useState([]); const [driverForm, setDriverForm] = useState(emptyDriver); const [editingDriverId, setEditingDriverId] = useState(null); const [driverMessage, setDriverMessage] = useState(''); const [busMessage, setBusMessage] = useState('');
  async function loadBuses() { const token = localStorage.getItem('transport_token'); const response = await fetch('http://localhost:5000/api/buses', { headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to load buses'); setBuses(data.buses); }
  async function handleBusSubmit(event) { event.preventDefault(); setBusMessage('Saving bus...'); try { const token = localStorage.getItem('transport_token'); const response = await fetch(`http://localhost:5000/api/buses${editingId ? `/${editingId}` : ''}`, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(busForm) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to save bus'); setBuses((current) => (editingId ? current.map((bus) => (bus._id === editingId ? data.bus : bus)) : [...current, data.bus]).sort((a, b) => a.busNumber.localeCompare(b.busNumber))); setBusForm(emptyBus); setEditingId(null); setBusMessage(editingId ? 'Bus updated successfully.' : 'Bus added successfully.'); } catch (error) { setBusMessage(error.message); } }
  async function handleBusDelete(id) { if (!window.confirm('Delete this bus?')) return; const token = localStorage.getItem('transport_token'); const response = await fetch(`http://localhost:5000/api/buses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) { setBusMessage(data.message || 'Unable to delete bus'); return; } setBuses((current) => current.filter((bus) => bus._id !== id)); }
  async function loadDrivers() { const token = localStorage.getItem('transport_token'); const response = await fetch('http://localhost:5000/api/drivers', { headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to load drivers'); setDrivers(data.drivers); }
  async function handleDriverSubmit(event) { event.preventDefault(); setDriverMessage('Saving driver...'); try { const token = localStorage.getItem('transport_token'); const response = await fetch(`http://localhost:5000/api/drivers${editingDriverId ? `/${editingDriverId}` : ''}`, { method: editingDriverId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(driverForm) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to save driver'); setDrivers((current) => (editingDriverId ? current.map((driver) => (driver._id === editingDriverId ? data.driver : driver)) : [...current, data.driver]).sort((a, b) => a.name.localeCompare(b.name))); setDriverForm(emptyDriver); setEditingDriverId(null); setDriverMessage(editingDriverId ? 'Driver updated successfully.' : 'Driver added successfully.'); } catch (error) { setDriverMessage(error.message); } }
  async function handleDriverDelete(id) { if (!window.confirm('Delete this driver?')) return; const token = localStorage.getItem('transport_token'); const response = await fetch(`http://localhost:5000/api/drivers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) { setDriverMessage(data.message || 'Unable to delete driver'); return; } setDrivers((current) => current.filter((driver) => driver._id !== id)); }
  useEffect(() => { loadBuses().catch((error) => setBusMessage(error.message)); loadDrivers().catch((error) => setDriverMessage(error.message)); }, []);
  const dashboardStats = [
    { label: 'Total buses', value: buses.length, detail: 'Live bus records' },
    { label: 'Total drivers', value: drivers.length, detail: 'Live driver records' },
    { label: 'Total students', value: 0, detail: 'Student module coming next' },
    { label: 'Active allocations', value: 0, detail: 'Allocation module coming next' },
  ];
  return <main className="dashboard-page admin-dashboard"><header className="topbar"><div><p className="eyebrow">Admin workspace</p><h1>Transport dashboard</h1></div><div className="topbar-actions"><span>{user.name}</span><button className="secondary-button" onClick={onLogout}>Sign out</button></div></header><section className="welcome-panel"><div><p className="eyebrow">Overview</p><h2>Good to see you, {user.name}.</h2><p className="muted">Manage the college transport system from one place.</p></div><span className="role-badge">Administrator</span></section><section className="stats-grid" aria-label="Transport statistics">{dashboardStats.map((stat) => <article className="stat-card" key={stat.label}><p className="muted">{stat.label}</p><strong>{stat.value}</strong><small>{stat.detail}</small></article>)}</section><section className="bus-section"><div><p className="eyebrow">Transport records</p><h2>Bus management</h2></div><form className="bus-form" onSubmit={handleBusSubmit}><input placeholder="Bus number" value={busForm.busNumber} onChange={(event) => setBusForm({ ...busForm, busNumber: event.target.value })} required /><input placeholder="Registration number" value={busForm.registrationNumber} onChange={(event) => setBusForm({ ...busForm, registrationNumber: event.target.value })} required /><input type="number" min="1" placeholder="Capacity" value={busForm.capacity} onChange={(event) => setBusForm({ ...busForm, capacity: event.target.value })} required /><select value={busForm.status} onChange={(event) => setBusForm({ ...busForm, status: event.target.value })}><option value="available">Available</option><option value="active">Active</option><option value="maintenance">Maintenance</option></select><button type="submit">{editingId ? 'Update bus' : 'Add bus'}</button></form>{busMessage && <p className="status-message">{busMessage}</p>}<div className="table-wrap"><table><thead><tr><th>Bus number</th><th>Registration</th><th>Capacity</th><th>Status</th><th>Action</th></tr></thead><tbody>{buses.map((bus) => <tr key={bus._id}><td>{bus.busNumber}</td><td>{bus.registrationNumber}</td><td>{bus.capacity}</td><td>{bus.status}</td><td><button className="secondary-button" onClick={() => { setEditingId(bus._id); setBusForm({ busNumber: bus.busNumber, registrationNumber: bus.registrationNumber, capacity: bus.capacity, status: bus.status }); }}>Edit</button> <button className="danger-button" onClick={() => handleBusDelete(bus._id)}>Delete</button></td></tr>)}{!buses.length && <tr><td colSpan="5" className="empty-cell">No buses have been added yet.</td></tr>}</tbody></table></div></section><section className="bus-section"><div><p className="eyebrow">People records</p><h2>Driver management</h2></div><form className="bus-form driver-form" onSubmit={handleDriverSubmit}><input placeholder="Full name" value={driverForm.name} onChange={(event) => setDriverForm({ ...driverForm, name: event.target.value })} required /><input placeholder="License number" value={driverForm.licenseNumber} onChange={(event) => setDriverForm({ ...driverForm, licenseNumber: event.target.value })} required /><input placeholder="Phone" value={driverForm.phone} onChange={(event) => setDriverForm({ ...driverForm, phone: event.target.value })} required /><input type="email" placeholder="Email" value={driverForm.email} onChange={(event) => setDriverForm({ ...driverForm, email: event.target.value })} required /><select value={driverForm.status} onChange={(event) => setDriverForm({ ...driverForm, status: event.target.value })}><option value="available">Available</option><option value="assigned">Assigned</option><option value="inactive">Inactive</option></select><button type="submit">{editingDriverId ? 'Update driver' : 'Add driver'}</button></form>{driverMessage && <p className="status-message">{driverMessage}</p>}<div className="table-wrap"><table><thead><tr><th>Name</th><th>License</th><th>Phone</th><th>Email</th><th>Status</th><th>Action</th></tr></thead><tbody>{drivers.map((driver) => <tr key={driver._id}><td>{driver.name}</td><td>{driver.licenseNumber}</td><td>{driver.phone}</td><td>{driver.email}</td><td>{driver.status}</td><td><button className="secondary-button" onClick={() => { setEditingDriverId(driver._id); setDriverForm({ name: driver.name, licenseNumber: driver.licenseNumber, phone: driver.phone, email: driver.email, status: driver.status }); }}>Edit</button> <button className="danger-button" onClick={() => handleDriverDelete(driver._id)}>Delete</button></td></tr>)}{!drivers.length && <tr><td colSpan="6" className="empty-cell">No drivers have been added yet.</td></tr>}</tbody></table></div></section></main>;
}

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  function handleLogout() { localStorage.removeItem('transport_token'); setUser(null); setView('landing'); }
  if (user?.role === 'admin') return <AdminDashboard user={user} onLogout={handleLogout} />;
  if (view === 'login') return <Login onLogin={setUser} onBack={() => setView('landing')} />;
  return <Landing onLogin={() => setView('login')} />;
}
