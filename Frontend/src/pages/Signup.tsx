import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "", about: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8085/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ REQUIRED
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registered ✅");
      window.location.href = "/login";
    } else {
      alert("Signup failed ❌");
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">SC</div>
          <span className="text-lg font-bold text-foreground">SCM <span className="text-primary">2.0</span></span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-1">Create Account</h2>
        <p className="text-sm text-muted-foreground mb-6">Start managing your contacts today</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="input-field" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input-field" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input-field" />
          <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="input-field" />
          <textarea name="about" placeholder="About you" onChange={handleChange} className="input-field h-16 resize-none" />
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Create Account <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
