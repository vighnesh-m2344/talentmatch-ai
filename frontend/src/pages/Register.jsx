import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { name, email, password } = form;

    // basic validation
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      toast.success("Account created 🎉");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a2342] flex-col justify-center px-14 relative overflow-hidden">

        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600/20" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-blue-600/15" />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Start your career <br />
            <span className="text-blue-400">journey with us</span>
          </h1>

          <p className="text-blue-100/60 mb-10">
            Join thousands of candidates finding their dream jobs.
          </p>

          <div className="flex gap-8 text-white">
            <div>
              <div className="text-blue-400 font-bold">12k+</div>
              <div className="text-xs text-blue-100/50">Jobs</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold">3.4k+</div>
              <div className="text-xs text-blue-100/50">Companies</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold">89k+</div>
              <div className="text-xs text-blue-100/50">Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">

        <div className="bg-white w-full max-w-md p-10 rounded-2xl border shadow-sm">

          <h2 className="text-2xl font-bold mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Start applying to jobs instantly
          </p>

          {/* NAME */}
          <input
            placeholder="Full name"
            className="w-full mb-3 px-4 py-2.5 border rounded-xl"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* EMAIL */}
          <input
            placeholder="Email"
            className="w-full mb-3 px-4 py-2.5 border rounded-xl"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2.5 border rounded-xl"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}