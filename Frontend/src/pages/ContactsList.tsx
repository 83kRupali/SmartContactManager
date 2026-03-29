
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Contact } from "@/types/contact";
import { motion } from "framer-motion";
import { Eye, Pencil, Archive, Star, Search, Pin } from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";

const ContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ FETCH CONTACTS (PAGINATION)
  const fetchContacts = async (pageNumber = 0) => {
    try {
      const res = await fetch(
        `http://localhost:8085/api/contacts?page=${pageNumber}&size=6`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setContacts(data.content || []);
      setTotalPages(data.totalPages || 0);

    } catch (err) {
      console.error("Fetch error:", err);
      setContacts([]);
    }
  };

  // ✅ FIXED (was wrong: pages ❌)
  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  // ✅ FILTER
  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ SORT
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.name.localeCompare(b.name);
  });

  // ✅ ARCHIVE
  const handleArchive = async (id: string) => {
    try {
      await fetch(`http://localhost:8085/api/contacts/archive/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchContacts(page); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FAVORITE
  const handleFavorite = async (id: string) => {
    try {
      await fetch(`http://localhost:8085/api/contacts/favorite/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchContacts(page);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ PIN
  const handlePin = async (id: string) => {
    try {
      await fetch(`http://localhost:8085/api/contacts/pin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchContacts(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Contacts</h1>
        <Link to="/contacts/add" className="btn-primary">
          + Add
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="input-field pl-9"
        />
      </div>

      {/* List */}
      <div className="card-elevated p-0 overflow-hidden">
        {sorted.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground">
            No contacts found
          </p>
        ) : (
          sorted.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 border-b hover:bg-accent/50"
            >
              <InitialsAvatar name={c.name} size="sm" />

              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.email}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handlePin(c.id)}>
                  <Pin
                    size={16}
                    className={c.pinned ? "text-green-500 fill-green-500" : ""}
                  />
                </button>

                <button onClick={() => handleFavorite(c.id)}>
                  <Star
                    size={16}
                    className={c.favorite ? "text-yellow-500 fill-yellow-500" : ""}
                  />
                </button>

                <button onClick={() => navigate(`/contacts/${c.id}`)}>
                  <Eye size={16} />
                </button>

                <button onClick={() => navigate(`/contacts/edit/${c.id}`)}>
                  <Pencil size={16} />
                </button>

                <button onClick={() => handleArchive(c.id)}>
                  <Archive size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ✅ PAGINATION (MOVED OUTSIDE MAP - FIXED) */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="btn-secondary"
        >
          Prev
        </button>

        <span className="text-sm">Page {page + 1}</span>

        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactsList;





