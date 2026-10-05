import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

function loadSessions() {
  try {
    const raw = localStorage.getItem("gems_employee_sessions");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function calcHours(loginIso, logoutIso) {
  if (!loginIso || !logoutIso) return null;
  const ms = new Date(logoutIso) - new Date(loginIso);
  if (Number.isNaN(ms) || ms < 0) return null;
  return ms / 3600000;
}

function formatHours(h) {
  if (h === null || h === undefined) return "—";
  const totalMinutes = Math.round(h * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}h ${mins}m (${h.toFixed(2)} hrs)`;
}

export default function EmployeeLogin() {
  const [sessions, setSessions] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_employee_auth") !== "true") {
      window.location.hash = "#/employeeaccess";
      return;
    }
    setEmployeeId(sessionStorage.getItem("gems_employee_id") || "1001");
    setEmployeeName(sessionStorage.getItem("gems_employee_name") || "");
    setSessions(loadSessions());
    window.scrollTo(0, 0);
  }, []);

  const saveSessions = (next) => {
    setSessions(next);
    try {
      localStorage.setItem("gems_employee_sessions", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const mySessions = useMemo(
    () => sessions.filter((s) => s.employeeId === employeeId),
    [sessions, employeeId]
  );

  const activeSession = useMemo(
    () => mySessions.find((s) => !s.logoutTime) || null,
    [mySessions]
  );

  const lastSession = useMemo(
    () => (mySessions.length ? mySessions[mySessions.length - 1] : null),
    [mySessions]
  );

  const handleLogin = () => {
    if (activeSession) return;
    const entry = {
      id: `sess-${Date.now()}`,
      employeeId,
      employeeName,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      totalHours: null,
    };
    saveSessions([...sessions, entry]);
  };

  const handleLogout = () => {
    if (!activeSession) return;
    const logoutTime = new Date().toISOString();
    const totalHours = calcHours(activeSession.loginTime, logoutTime);
    const next = sessions.map((s) =>
      s.id === activeSession.id ? { ...s, logoutTime, totalHours } : s
    );
    saveSessions(next);
  };

  const handleEmployeeLogout = () => {
    sessionStorage.removeItem("gems_employee_auth");
    sessionStorage.removeItem("gems_employee_id");
    sessionStorage.removeItem("gems_employee_name");
    window.location.hash = "#/dashboard";
  };

  const displaySession = activeSession || lastSession;

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy px-5 pb-16 pt-28 sm:px-8 md:pt-32">
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
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_14px_40px_rgba(3,20,38,0.16)]">
              <div className="p-7 sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                  Employee Login
                </p>
                <h1 className="mt-2 font-serif text-3xl font-bold text-cream">
                  {employeeName || "Employee"} ({employeeId})
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-mutedwhite/70">
                  {activeSession
                    ? "You are logged in. Click Logout to finish and see your total working hours."
                    : "Click Login to start your shift, Logout to end it."}
                </p>

                {displaySession && displaySession.logoutTime ? (
                  <div className="mt-6 rounded-2xl border border-gold/25 bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold uppercase tracking-[0.12em] text-cream/70">
                        Total Working Hours
                      </span>
                      <span className="font-semibold text-gold">
                        {formatHours(displaySession.totalHours)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-mutedwhite/60">
                    {activeSession
                      ? "Shift in progress. Your total working hours will show here after logout."
                      : "No completed shift yet. Click Login to start."}
                  </p>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={!!activeSession}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={!activeSession}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-7 py-3 text-sm font-semibold text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>

                <div className="mt-6 text-center text-[13px]">
                  <button
                    type="button"
                    onClick={handleEmployeeLogout}
                    className="text-mutedwhite/60 transition-colors hover:text-gold"
                  >
                    Back to Staff Dashboard
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
