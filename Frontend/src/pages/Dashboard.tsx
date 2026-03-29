
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ContactRound, Star, UserPlus, Cake,
  Archive, Pin, Download
} from "lucide-react";
import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import InitialsAvatar from "@/components/InitialsAvatar";
import { format } from "date-fns";

const Dashboard = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [archived, setArchived] = useState<Contact[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Contact[]>([]);

  // ✅ FETCH CONTACTS (FIXED FOR PAGINATION RESPONSE)
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

      const allContacts = data.content || []; // ✅ FIX

      setContacts(allContacts);

      // ✅ archived
      setArchived(allContacts.filter((c: Contact) => c.archived));

      // ✅ birthdays
      const today = new Date();
      const next30 = new Date();
      next30.setDate(today.getDate() + 30);

      const birthdays = allContacts.filter((c: Contact) => {
        if (!c.birthday) return false;

        const bday = new Date(c.birthday);
        const thisYear = new Date(
          today.getFullYear(),
          bday.getMonth(),
          bday.getDate()
        );

        if (thisYear < today) {
          thisYear.setFullYear(thisYear.getFullYear() + 1);
        }

        return thisYear <= next30;
      });

      setUpcomingBirthdays(birthdays);

    } catch (err) {
      console.error(err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const favorites = contacts.filter((c) => c.favorite);
  const pinned = contacts.filter((c) => c.pinned);

  // ✅ EXPORT CSV
  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone"];

    const rows = contacts.map((c) => [
      c.name,
      c.email,
      c.phoneNumber,
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const stats = [
    { title: "Total Contacts", value: contacts.length, icon: ContactRound, link: "/contacts" },
    { title: "Favorites", value: favorites.length, icon: Star, link: "/favorites" },
    { title: "Pinned", value: pinned.length, icon: Pin, link: "/contacts" },
    { title: "Archived", value: archived.length, icon: Archive, link: "/archived" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleExportCSV} className="btn-secondary flex gap-2">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}>
              <Link to={stat.link} className="card-elevated p-4 flex gap-3 items-center">
                <Icon size={18} />
                <div>
                  <p className="font-bold">{stat.value}</p>
                  <p className="text-xs">{stat.title}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div>
          <h2 className="font-semibold flex gap-2 items-center mb-2">
            <Cake size={18} /> Upcoming Birthdays
          </h2>

          {upcomingBirthdays.map((c) => (
            <Link key={c.id} to={`/contacts/${c.id}`} className="card-elevated flex gap-3 items-center">
              <InitialsAvatar name={c.name} size="sm" />
              <div>
                <p>{c.name}</p>
                <p className="text-xs">
                  {format(new Date(c.birthday!), "MMM d")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Add */}
      <div className="card-elevated text-center py-8">
        <UserPlus size={32} className="mx-auto mb-2" />
        <Link to="/contacts/add" className="btn-primary">
          Add Contact
        </Link>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <h2 className="font-semibold flex gap-2 items-center mb-2">
            <Pin size={18} /> Pinned
          </h2>

          {pinned.map((c) => (
            <Link key={c.id} to={`/contacts/${c.id}`} className="card-elevated flex gap-3 items-center">
              <InitialsAvatar name={c.name} size="sm" />
              <div>
                <p>{c.name}</p>
                <p className="text-xs">{c.email}</p>
              </div>
              {c.favorite && <Star size={14} className="ml-auto fill-yellow-500" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;




















