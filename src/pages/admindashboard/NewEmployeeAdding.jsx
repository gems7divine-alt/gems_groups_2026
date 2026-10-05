import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2, UserPlus, X, Save } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

function loadEmployees() {
  try {
    const raw = localStorage.getItem("gems_employees");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function NewEmployeeAdding() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", employeeId: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_admin_auth") !== "true") {
      window.location.hash = "#/adminpassword";
      return;
    }
    setEmployees(loadEmployees());
    window.scrollTo(0, 0);
  }, []);

  const saveEmployees = (next) => {
    setEmployees(next);
    try {
      localStorage.setItem("gems_employees", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = form.username.trim();
    const email = form.email.trim();
    const employeeId = form.employeeId.trim();

    if (!username) {
      setError("User name is required.");
      return;
    }
    if (!email) {
      setError("Email ID is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid Email ID.");
      return;
    }
    if (!employeeId) {
      setError("Employee ID is required.");
      return;
    }
    const duplicate = employees.some(
      (emp) =>
        emp.id !== editingId &&
        ((emp.employeeId && emp.employeeId.toLowerCase() === employeeId.toLowerCase()) ||
          emp.id === employeeId)
    );
    if (duplicate) {
      setError("This Employee ID already exists.");
      return;
    }

    if (editingId) {
      const next = employees.map((emp) =>
        emp.id === editingId
          ? {
              ...emp,
              id: employeeId,
              employeeId,
              name: username,
              username,
              email,
              contact: email,
            }
          : emp
      );
      // Keep attendance in sync if the Employee ID changed.
      if (editingId !== employeeId) {
        try {
          const raw = localStorage.getItem("gems_attendance");
          const att = raw ? JSON.parse(raw) : {};
          if (att && typeof att === "object") {
            const migrated = {};
            Object.entries(att).forEach(([day, record]) => {
              if (record && typeof record === "object" && editingId in record) {
                const { [editingId]: status, ...rest } = record;
                migrated[day] = { ...rest, [employeeId]: status };
              } else {
                migrated[day] = record;
              }
            });
            localStorage.setItem("gems_attendance", JSON.stringify(migrated));
          }
        } catch {
          /* ignore */
        }
      }
      saveEmployees(next);
    } else {
      const entry = {
        id: employeeId,
        employeeId,
        name: username,
        username,
        email,
        contact: email,
        role: "Staff",
      };
      saveEmployees([...employees, entry]);
    }
    setForm({ username: "", email: "", employeeId: "" });
    setError("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      username: emp.username || emp.name || "",
      email: emp.email || emp.contact || "",
      employeeId: emp.employeeId || emp.id || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
    setForm({ username: "", email: "", employeeId: "" });
  };

  const handleDelete = (id) => {
    saveEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-[92svh] overflow-hidden bg-deepnavy px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/office.png')" }}
          role="img"
          aria-label="GEMS Groups office background"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/85 to-deepnavy/60"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
              Admin Dashboard
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-cream sm:text-4xl md:text-[2.6rem]">
              New Employee Adding
            </h1>
            <p className="mt-3 text-sm text-mutedwhite/70 sm:text-[15px]">
              Click New to add an employee. All added employees appear below.
            </p>
          </Reveal>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-between gap-3">
            <a
              href="#/admindashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-cream"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Admin Dashboard
            </a>
            {!showForm && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ username: "", email: "", employeeId: "" });
                  setShowForm(true);
                  setError("");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(217,164,65,0.45)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New
              </button>
            )}
          </div>

          {showForm && (
            <Reveal>
              <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gold/25 bg-deepnavy p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-cream">
                    {editingId ? "Edit Employee" : "Add Employee"}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    aria-label="Close form"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-deepnavy"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="emp-username" className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80">
                      User Name *
                    </label>
                    <input
                      id="emp-username"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Enter user name"
                      className="mt-2 w-full rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="emp-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80">
                      Email ID *
                    </label>
                    <input
                      id="emp-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter email ID"
                      className="mt-2 w-full rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="emp-employeeid" className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80">
                      Employee ID *
                    </label>
                    <input
                      id="emp-employeeid"
                      value={form.employeeId}
                      onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                      placeholder="Enter employee ID"
                      className="mt-2 w-full rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-gold"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="text-[13px] font-medium text-red-400">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02]"
                  >
                    {editingId ? (
                      <Save className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <UserPlus className="h-4 w-4" aria-hidden="true" />
                    )}
                    {editingId ? "Update" : "Submit"}
                  </button>
                </form>
              </div>
            </Reveal>
          )}

          <div className="mt-8 rounded-2xl border border-gold/25 bg-deepnavy p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-cream">
              Employees ({employees.length})
            </h2>
            <div className="mt-4 space-y-3">
              {employees.length === 0 && (
                <p className="text-sm text-mutedwhite/60">
                  No employees added yet. Click New to add the first employee.
                </p>
              )}
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-cream">
                      {emp.username || emp.name}
                    </p>
                    <p className="mt-0.5 text-xs text-mutedwhite/60">
                      {emp.email || emp.contact} • ID: {emp.employeeId || emp.id}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(emp)}
                      aria-label={`Edit ${emp.username || emp.name}`}
                      title="Edit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-deepnavy"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(emp.id)}
                      aria-label={`Remove ${emp.username || emp.name}`}
                      title="Remove"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-400/40 text-red-300 transition-colors hover:bg-red-400 hover:text-deepnavy"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
