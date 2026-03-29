
import { useState, useEffect } from "react";
import { Contact } from "@/types/contact";
import { motion } from "framer-motion";
import { ArchiveRestore, Trash2, Search, Archive } from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";

const ArchivedContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);          // ✅ pagination state
  const [totalPages, setTotalPages] = useState(0);

  // ✅ FETCH WITH PAGINATION
  const fetchArchivedContacts = async (pageNum = 0) => {
    try {
      const res = await fetch(
        `http://localhost:8085/api/contacts/archived?page=${pageNum}&size=6`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setContacts(data.content || []);       // ✅ avoid null
      setTotalPages(data.totalPages || 0);

    } catch (err) {
      console.error(err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchArchivedContacts(page);   // ✅ refetch on page change
  }, [page]);

  // ✅ SAFE FILTER (fix your error)
  const filtered = contacts.filter(
    (c) =>
      c &&
      c.name &&
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ RESTORE
  const handleRestore = async (id: string) => {
    await fetch(
      `http://localhost:8085/api/contacts/unarchive/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchArchivedContacts(page); // refresh
  };

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete permanently?")) return;

    await fetch(
      `http://localhost:8085/api/contacts/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchArchivedContacts(page); // refresh
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Archived Contacts</h1>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="input-field pl-9"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card-elevated text-center py-10">
          <Archive size={32} className="mx-auto mb-2" />
          <p>No archived contacts</p>
        </div>
      ) : (
        <div className="card-elevated p-0 overflow-hidden">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 border-b"
            >
              <InitialsAvatar name={c.name} size="sm" />

              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm">{c.email}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleRestore(c.id)}>
                  <ArchiveRestore size={16} className="text-green-500" />
                </button>

                <button onClick={() => handleDelete(c.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ✅ PAGINATION UI */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="btn-secondary"
        >
          Prev
        </button>

        <span>Page {page + 1}</span>

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

export default ArchivedContacts;





