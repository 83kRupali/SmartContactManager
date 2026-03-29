
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Contact } from "@/types/contact";
import { motion } from "framer-motion";
import { Eye, Pencil, Archive, Star, Search } from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";
import ContactActions from "@/components/ContactActions";

const FavouriteContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ FIXED FETCH (pagination response)
  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "http://localhost:8085/api/contacts?page=0&size=100",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      const allContacts = data.content || []; // ✅ IMPORTANT

      const favs = allContacts.filter((c: Contact) => c.favorite);

      setContacts(favs);

    } catch (err) {
      console.error(err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ SEARCH
  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ ARCHIVE
  const handleArchive = async (id: string) => {
    try {
      await fetch(
        `http://localhost:8085/api/contacts/archive/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setContacts((prev) => prev.filter((c) => c.id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UNFAVORITE
  const handleUnfavorite = async (id: string) => {
    try {
      await fetch(
        `http://localhost:8085/api/contacts/favorite/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setContacts((prev) => prev.filter((c) => c.id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Favorite Contacts</h1>
        <p className="text-sm text-muted-foreground">
          {contacts.length} favorites
        </p>
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
      {filtered.length === 0 ? (
        <div className="card-elevated text-center py-10">
          <Star size={32} className="mx-auto text-muted-foreground mb-2" />
          <p>No favorite contacts</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card-elevated text-center"
            >
              <InitialsAvatar name={c.name} size="md" className="mb-3" />

              <h3>{c.name}</h3>
              <p className="text-xs">{c.email}</p>
              <p className="text-xs">{c.phoneNumber}</p>

              <div className="mt-2">
                <ContactActions
                  phone={c.phoneNumber}
                  email={c.email}
                  name={c.name}
                />
              </div>

              <div className="flex justify-center gap-2 mt-2">

                <button onClick={() => handleUnfavorite(c.id)}>
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                </button>

                <button onClick={() => navigate(`/contacts/${c.id}`)}>
                  <Eye size={14} />
                </button>

                <button onClick={() => navigate(`/contacts/edit/${c.id}`)}>
                  <Pencil size={14} />
                </button>

                <button onClick={() => handleArchive(c.id)}>
                  <Archive size={14} />
                </button>

              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteContacts;