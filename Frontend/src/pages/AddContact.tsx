
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DuplicateWarning from "@/components/DuplicateWarning";
import { checkDuplicate } from "@/lib/contacts";

const AddContact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    description: "",
    websiteLink: "",
    linkedInLink: "",
    birthday: "",
  });

  // ✅ HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ DUPLICATE CHECK
  const duplicates = useMemo(
    () => checkDuplicate(form.email, form.phoneNumber),
    [form.email, form.phoneNumber]
  );

  // ✅ SUBMIT (JWT BASED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8085/api/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ REQUIRED
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          address: form.address,
          description: form.description,
          websiteLink: form.websiteLink,
          linkedInLink: form.linkedInLink,
          birthday: form.birthday || null,
          favorite: false,
          pinned: false,
          archived: false,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Backend error:", error);
        alert("Error saving contact ❌");
        return;
      }

      alert("Contact Saved ✅");
      navigate("/contacts");

    } catch (err) {
      console.error("Fetch error:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated"
      >
        <h2 className="text-xl font-bold">New Contact</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add a new contact to your collection
        </p>

        <DuplicateWarning
          emailDup={duplicates.emailDup}
          phoneDup={duplicates.phoneDup}
        />

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Name *"
              required
              onChange={handleChange}
              className="input-field"
            />
            <input
              name="email"
              type="email"
              placeholder="Email *"
              required
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="phoneNumber"
              placeholder="Phone"
              onChange={handleChange}
              className="input-field"
            />
            <input
              name="birthday"
              type="date"
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="input-field"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="input-field h-20"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="websiteLink"
              placeholder="Website"
              onChange={handleChange}
              className="input-field"
            />
            <input
              name="linkedInLink"
              placeholder="LinkedIn"
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Add Contact
            </button>
            <button type="reset" className="btn-secondary">
              Clear
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default AddContact;






