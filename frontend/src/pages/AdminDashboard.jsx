import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function AdminDashboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchJobs()]);
      setLoading(false);
    };
    load();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data.data || {});
    } catch {
      toast.error("Failed to load stats");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.data || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const viewApplicants = async (jobId, jobTitle) => {
    try {
      const res = await API.get(`/jobs/${jobId}/applications`);
      setSelectedApps(res.data.data || []);
      setSelectedJobId(jobId);
      setSelectedJobTitle(jobTitle);
      setFilter("ALL");
    } catch {
      toast.error("Failed to load applicants");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/jobs/applications/${id}/status`, { status });

      toast.success(`Marked as ${status}`);

      setSelectedApps((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredApps =
    filter === "ALL"
      ? selectedApps
      : selectedApps.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-5">

        <h1 className="text-xl font-bold mb-8 text-gray-900 dark:text-white">
          TalentMatch AI
        </h1>

        <div className="space-y-2 text-sm">

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Jobs
          </button>

          <button
            onClick={() => navigate("/applications")}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Applications
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1">

        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* HEADER */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Admin Dashboard
          </h1>

          {/* STATS */}
          <div className="grid sm:grid-cols-3 gap-5 mb-8">

            <StatCard label="Total Jobs" value={stats.jobs ?? 0} />
            <StatCard label="Applications" value={stats.applications ?? 0} />
            <StatCard label="Users" value={stats.users ?? 0} />

          </div>

          {/* CONTENT */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* JOBS */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Jobs</h2>

              <div className="space-y-3">

                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700"
                  >
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>

                    <div className="flex gap-2 mt-3">

                      <button
                        onClick={() => viewApplicants(job.id, job.title)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg border"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* APPLICANTS */}
            <div>

              <h2 className="font-semibold text-lg mb-4">
                {selectedJobId
                  ? `Applicants - ${selectedJobTitle}`
                  : "Applicants"}
              </h2>

              {!selectedJobId ? (
                <Empty text="Select a job to view applicants" />
              ) : (
                <>

                  {/* FILTER */}
                  <div className="flex gap-2 mb-3 flex-wrap">

                    {["ALL", "PENDING", "SHORTLISTED", "HIRED", "REJECTED"].map(
                      (f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`text-xs px-3 py-1 rounded-full border ${
                            filter === f
                              ? "bg-black text-white"
                              : "bg-white dark:bg-slate-800"
                          }`}
                        >
                          {f}
                        </button>
                      )
                    )}

                  </div>

                  {/* LIST */}
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border mb-3"
                    >

                      <p className="text-sm">{app.user?.email}</p>

                      <a
                        href={app.resume}
                        target="_blank"
                        className="text-blue-600 text-xs"
                      >
                        View Resume ↗
                      </a>

                      <div className="flex gap-2 mt-3 flex-wrap">

                        <Btn
                          label="Shortlist"
                          onClick={() => updateStatus(app.id, "SHORTLISTED")}
                        />

                        <Btn
                          label="Hire"
                          onClick={() => updateStatus(app.id, "HIRED")}
                        />

                        <Btn
                          label="Reject"
                          onClick={() => updateStatus(app.id, "REJECTED")}
                        />

                      </div>

                    </div>
                  ))}

                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* UI COMPONENTS */

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Btn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-slate-700 hover:opacity-80"
    >
      {label}
    </button>
  );
}

function Empty({ text }) {
  return (
    <div className="p-8 text-center text-gray-400 border rounded-xl">
      {text}
    </div>
  );
}