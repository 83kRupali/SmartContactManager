import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contact } from "@/types/contact";
import { motion } from "framer-motion";
import {
  ArrowLeft, Globe, Linkedin, Star, Phone,
  MapPin, Mail, Pencil, Pin, Clock, Cake
} from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";
import ContactActions from "@/components/ContactActions";
import { format } from "date-fns";

const ViewContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = localStorage.getItem("userId"); // ✅ REQUIRED

  // ✅ FETCH CONTACT
  const fetchContact = async () => {
  if (!id) return;

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

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();
    setContact(data);
  } catch (err) {
    console.error(err);
    navigate("/contacts");
  }
};

  useEffect(() => {
    fetchContact();
  }, [id]);

  if (!contact)
    return <p className="p-6 text-center text-muted-foreground">Loading...</p>;

  const refresh = () => fetchContact();

  // ✅ FAVORITE
const handleFavorite = async () => {
  const token = localStorage.getItem("token");

  await fetch(
    `http://localhost:8085/api/contacts/favorite/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  refresh();
};

  // ✅ PIN
 const handlePin = async () => {
  const token = localStorage.getItem("token");

  await fetch(
    `http://localhost:8085/api/contacts/pin/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  refresh();
};


  const handleContacted = async () => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8085/api/contacts/contacted/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    refresh();
  } catch {
    console.warn("contacted API not implemented");
  }
};


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated text-center"
      >
        <div className="relative inline-block">
          <InitialsAvatar
            name={contact.name}
            picture={contact.picture}
            size="lg"
            className="mx-auto border-4 border-background shadow-lg"
          />

          <button
            onClick={handleFavorite}
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-card border flex items-center justify-center"
          >
            <Star
              size={14}
              className={
                contact.favorite
                  ? "text-warning fill-warning"
                  : "text-muted-foreground"
              }
            />
          </button>
        </div>

        <h2 className="text-xl font-bold mt-3 flex items-center justify-center gap-2">
          {contact.name}
          {contact.pinned && (
            <Pin size={14} className="text-success fill-success" />
          )}
        </h2>

        <p className="text-sm text-muted-foreground">
          {contact.description || "No description"}
        </p>

        <div className="flex justify-center gap-2 mt-4">
          <ContactActions
            phone={contact.phoneNumber}
            email={contact.email}
            name={contact.name}
            onContacted={handleContacted}
          />

          <button
            onClick={handlePin}
            className={`p-2 rounded-lg border ${
              contact.pinned
                ? "border-success bg-success/10"
                : "border-border"
            }`}
          >
            <Pin
              size={16}
              className={
                contact.pinned
                  ? "text-success"
                  : "text-muted-foreground"
              }
            />
          </button>
        </div>

        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
            <Mail size={16} />
            <span>{contact.email}</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
            <Phone size={16} />
            <span>{contact.phoneNumber || "N/A"}</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
            <MapPin size={16} />
            <span>{contact.address || "N/A"}</span>
          </div>

          {contact.birthday && (
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
              <Cake size={16} />
              <span>
                {format(new Date(contact.birthday), "MMMM d, yyyy")}
              </span>
            </div>
          )}

          {contact.lastContacted && (
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
              <Clock size={16} />
              <span>
                Last contacted:{" "}
                {format(new Date(contact.lastContacted), "MMM d, yyyy")}
              </span>
            </div>
          )}

          {contact.websiteLink && (
            <a href={contact.websiteLink} target="_blank">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <Globe size={16} />
                <span>Website</span>
              </div>
            </a>
          )}

          {contact.linkedInLink && (
            <a href={contact.linkedInLink} target="_blank">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </div>
            </a>
          )}
        </div>

        <button
          onClick={() => navigate(`/contacts/edit/${contact.id}`)}
          className="btn-primary mt-6"
        >
          <Pencil size={14} /> Edit Contact
        </button>
      </motion.div>
    </div>
  );
};

export default ViewContact;

































