export default function JobCard({
  job,
  isApplied,
  file,
  uploading,
  onFileChange,
  onRemoveFile,
  onApply,
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

      {/* TOP BADGES */}
      <div className="flex items-center justify-between mb-3">

        <div className="flex gap-2 flex-wrap">

          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
             {job.location || "Remote"}
          </span>

          {job.type && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              {job.type}
            </span>
          )}

          {job.package && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300">
               {job.package}
            </span>
          )}

        </div>

        {/* STATUS BADGE */}
        {isApplied && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Applied ✓
          </span>
        )}

      </div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
        {job.title}
      </h2>

      {/* COMPANY */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {job.company}
      </p>

      {/* DIVIDER */}
      <div className="my-4 border-t border-gray-100 dark:border-slate-800" />

      {/* FILE UPLOAD */}
      {!isApplied && (
        <div className="mb-3">

          {!file ? (
            <label className="cursor-pointer inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition">
               Upload Resume (PDF)
              <input
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex justify-between items-center text-xs bg-gray-50 dark:bg-slate-800 px-3 py-2 rounded-lg mt-2">
              <span className="truncate text-gray-700 dark:text-gray-300">
                {file.name}
              </span>
              <button
                onClick={onRemoveFile}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Remove
              </button>
            </div>
          )}

        </div>
      )}

      {/* APPLY BUTTON */}
      <button
        onClick={onApply}
        disabled={isApplied || uploading}
        className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${
          isApplied
            ? "bg-green-600 text-white"
            : uploading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {uploading
          ? "Applying..."
          : isApplied
          ? "Already Applied ✓"
          : "Apply Now"}
      </button>

    </div>
  );
}