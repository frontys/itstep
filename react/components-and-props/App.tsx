const UserBadge = ({ label, role }) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span className="badge">{role}</span>
        <strong>{label}</strong>
    </div>
);

const MetricCard = ({ title, value, unit }) => (
    <div className="card" style={{ marginBottom: 0 }}>
        <p className="subtitle">{title}</p>
        <h3 style={{ fontSize: '24px', color: '#e63956', marginTop: '6px' }}>{value} <span style={{ fontSize: '14px', color: '#9ca3af' }}>{unit}</span></h3>
    </div>
);

function App() {
    const [theme, setTheme] = React.useState('Crimson Dark');
    const [counter, setCounter] = React.useState(12);

    return (
        <div className="container">
            <header>
                <div>
                    <h1>React Components & Props Hierarchy</h1>
                    <p className="subtitle">Modular layout driven by structured typed props</p>
                </div>
                <UserBadge label="Arthur Pendelton" role="Lead Architect" />
            </header>
            <div className="grid" style={{ marginBottom: '20px' }}>
                <MetricCard title="System Performance" value="99.8" unit="%" />
                <MetricCard title="Active Connections" value={counter} unit="sessions" />
                <MetricCard title="Active Theme" value={theme} unit="style" />
            </div>
            <div className="card">
                <h2>Interactive Props Control</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setCounter(c => c + 1)}>Increment Connections</button>
                    <button className="button-secondary" onClick={() => setCounter(12)}>Reset Metric</button>
                </div>
            </div>
        </div>
    );
}