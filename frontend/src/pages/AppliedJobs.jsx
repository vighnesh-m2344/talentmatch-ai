import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const res = await API.get("/applications/my");
      setApplications(res.data.data || []);
    } catch (err) {
      console.log("Error fetching applied jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "HIRED":
        return "bg-green-50 text-green-700 border-green-200";
      case "SHORTLISTED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "REJECTED":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  /* FILTER */
  const filtered =
    filter === "ALL"
      ? applications
      : applications.filter((a) => a.status === filter);

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-10 grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-36 bg-white rounded-2xl border animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            My Applications
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {applications.length} total applications
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["ALL", "APPLIED", "SHORTLISTED", "HIRED", "REJECTED"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  filter === f
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* EMPTY */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-600 font-medium">
              No applications found
            </p>
            <a
              href="/jobs"
              className="mt-4 inline-block text-blue-600 text-sm hover:underline"
            >
              Browse jobs →
            </a>
          </div>
        ) : (
          /* GRID */
          <div className="grid gap-4 md:grid-cols-2">

            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >

                {/* TOP */}
                <div className="flex justify-between items-start gap-3">

                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {app.job?.title || "Job Title"}
                    </h2>

                    <p className="text-sm text-gray-500 truncate">
                      {app.job?.company || "Company"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    {app.status || "APPLIED"}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="mt-4 pt-3 border-t flex justify-between items-center">

                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 font-medium hover:text-blue-700"
                  >
                    View Resume ↗
                  </a>

                  <span className="text-xs text-gray-400">
                    ID: {app.id.slice(0, 6)}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}