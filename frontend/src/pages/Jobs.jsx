import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import JobCard from "../components/JobCard";
import Input from "../components/ui/Input";

export default function Jobs({ darkMode, setDarkMode }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingJobId, setUploadingJobId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await API.get("/applications/my");
      const ids = (res.data.data || []).map((a) => a.jobId);
      setAppliedJobs(ids);
    } catch (err) {
      console.log("Applied jobs fetch error:", err.message);
    }
  };

  const handleFile = (e, jobId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Max 2MB allowed");
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [jobId]: file,
    }));
  };

  const removeFile = (jobId) => {
    setSelectedFiles((prev) => {
      const copy = { ...prev };
      delete copy[jobId];
      return copy;
    });
  };

  const applyJob = async (jobId) => {
    if (uploadingJobId) return toast.error("Please wait...");

    const file = selectedFiles[jobId];
    const job = jobs.find((j) => j.id === jobId);

    if (!file) return toast.error("Upload resume first");

    try {
      setUploadingJobId(jobId);

      const form = new FormData();
      form.append("resume", file);

      const upload = await API.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await API.post("/applications", {
        jobId,
        resume: upload.data.fileUrl,
      });

      setAppliedJobs((prev) => [...new Set([...prev, jobId])]);
      removeFile(jobId);

      toast.success("Applied successfully 🚀");

      // EMAIL NOTIFICATION
      await emailjs.send(
        "service_50pj64l",
        "template_sl30fpw",
        {
          job_title: job?.title,
          company: job?.company,
          to_email: "adminv147@gmail.com",
        },
        "WVq2mgvNrNwnvQtvi"
      );
    } catch (err) {
      console.log(err);
      toast.error("Apply failed");
    } finally {
      setUploadingJobId(null);
    }
  };

  // FILTER LOGIC
  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const location = job.location?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";

    return (
      title.includes(search.toLowerCase()) &&
      location.includes(locationFilter.toLowerCase()) &&
      company.includes(companyFilter.toLowerCase()) &&
      (jobType ? job.type === jobType : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Find Your Dream Job
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Apply instantly, track applications, and get hired faster
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-3 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800">

          <Input
            placeholder="Search role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Input
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          <Input
            placeholder="Company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-3 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="REMOTE">Remote</option>
          </select>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No jobs found 😕
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {filteredJobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);
              const file = selectedFiles[job.id];
              const uploading = uploadingJobId === job.id;

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={isApplied}
                  file={file}
                  uploading={uploading}
                  onFileChange={(e) => handleFile(e, job.id)}
                  onRemoveFile={() => removeFile(job.id)}
                  onApply={() => applyJob(job.id)}
                />
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}