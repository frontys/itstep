function App() {
    const [form, setForm] = React.useState({
        fullName: 'Marcus Vance',
        email: 'marcus@engineering.org',
        category: 'Hardware',
        priority: 'High',
        newsletter: true
    });
    const [submitted, setSubmitted] = React.useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted({ ...form, timestamp: new Date().toLocaleString() });
    };

    return (
        <div className="container">
            <header>
                <div>
                    <h1>Controlled Form Architecture & Validation</h1>
                    <p className="subtitle">Form state aggregation, typed inputs and dynamic preview</p>
                </div>
            </header>
            <div className="grid">
                <div className="card">
                    <h2>Engineering Request Form</h2>
                    <form onSubmit={handleSubmit}>
                        <label style={{ fontSize: '13px', color: '#9ca3af' }}>Full Name</label>
                        <input name="fullName" value={form.fullName} onChange={handleChange} required />

                        <label style={{ fontSize: '13px', color: '#9ca3af' }}>Email Address</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required />

                        <label style={{ fontSize: '13px', color: '#9ca3af' }}>Department</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                            <option value="Hardware">Hardware Systems</option>
                            <option value="Networking">Networking & Security</option>
                            <option value="Cloud">Cloud Architecture</option>
                        </select>

                        <label style={{ fontSize: '13px', color: '#9ca3af' }}>Priority Level</label>
                        <select name="priority" value={form.priority} onChange={handleChange}>
                            <option value="Standard">Standard</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '10px 0' }}>
                            <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange} style={{ width: 'auto', marginBottom: 0 }} />
                            <span style={{ fontSize: '13px' }}>Notify on status change</span>
                        </label>

                        <button type="submit" style={{ width: '100%' }}>Submit Request</button>
                    </form>
                </div>
                <div className="card">
                    <h2>Form Submission Result</h2>
                    {submitted ? (
                        <div className="output">
                            SUBMITTED TICKET:
Name: {submitted.fullName}
Email: {submitted.email}
Dept: {submitted.category}
Priority: {submitted.priority}
Notify: {submitted.newsletter ? "Yes" : "No"}
Time: {submitted.timestamp}
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af' }}>Complete the form on the left to generate the request payload.</p>
                    )}
                </div>
            </div>
        </div>
    );
}