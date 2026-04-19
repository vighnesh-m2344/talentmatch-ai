export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
}