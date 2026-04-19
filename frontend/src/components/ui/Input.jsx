export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}