import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ContactRound, Star, Zap } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8085/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ REQUIRED
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Login failed ❌");
      return;
    }

    const data = await res.json();

    // ✅ STORE TOKEN + USER INFO
    localStorage.setItem("token", data.token); // 🔥 MOST IMPORTANT
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("user", JSON.stringify(data));

    // redirect
    window.location.href = "/";

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};


  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-primary p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center font-bold text-lg">SC</div>
            <span className="text-2xl font-bold">SCM 2.0</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Manage your contacts smartly</h1>
          <p className="text-primary-foreground/80 mb-8">Organize, search, and keep track of all your important contacts in one place.</p>
          <div className="space-y-3">
            {[
              { icon: ContactRound, text: "Organize unlimited contacts" },
              { icon: Star, text: "Mark favorites for quick access" },
              { icon: Zap, text: "Lightning fast search" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <item.icon size={16} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">SC</div>
            <span className="text-lg font-bold text-foreground">SCM <span className="text-primary">2.0</span></span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;