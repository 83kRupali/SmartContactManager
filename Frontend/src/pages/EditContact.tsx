
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contact } from "@/types/contact";
import { motion } from "framer-motion";
import DuplicateWarning from "@/components/DuplicateWarning";

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Contact | null>(null);

  // ✅ FETCH CONTACT (JWT BASED)
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8085/api/contacts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Fetch failed");
          navigate("/contacts");
          return;
        }

        const data = await res.json();

        setForm({
          ...data,
          favorite: data.favorite ?? false,
          pinned: data.pinned ?? false,
          archived: data.archived ?? false,
        });

      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/contacts");
      }
    };

    if (id) fetchContact();
  }, [id]);

  // ✅ DUPLICATE CHECK (KEEP SAME)
  const duplicates = useMemo(
    () => ({ emailDup: false, phoneDup: false }),
    []
  );

  if (!form) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  // ✅ HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  // ✅ UPDATE CONTACT (JWT BASED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8085/api/contacts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ REQUIRED
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Update error:", err);
        alert("Update failed ❌");
        return;
      }

      alert("Updated ✅");
      navigate("/contacts");

    } catch (err) {
      console.error("Update error:", err);
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
        <h2 className="text-xl font-bold">Edit Contact</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update contact information
        </p>

        <DuplicateWarning
          emailDup={duplicates.emailDup}
          phoneDup={duplicates.phoneDup}
        />

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} className="input-field" />
            <input name="email" value={form.email} onChange={handleChange} className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} className="input-field" />
            <input name="birthday" type="date" value={form.birthday || ""} onChange={handleChange} className="input-field" />
          </div>

          <input name="address" value={form.address || ""} onChange={handleChange} className="input-field" />

          <textarea name="description" value={form.description || ""} onChange={handleChange} className="input-field h-20" />

          <div className="grid grid-cols-2 gap-4">
            <input name="websiteLink" value={form.websiteLink || ""} onChange={handleChange} className="input-field" />
            <input name="linkedInLink" value={form.linkedInLink || ""} onChange={handleChange} className="input-field" />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="favorite"
              checked={form.favorite}
              onChange={handleChange}
            />
            Mark as Favorite
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Update Contact
            </button>
            <button
              type="button"
              onClick={() => navigate("/contacts")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default EditContact;



