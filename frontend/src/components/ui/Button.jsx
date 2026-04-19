export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition ${className}`}
    >
      {children}
    </button>
  );
}