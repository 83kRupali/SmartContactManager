import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import InitialsAvatar from "./InitialsAvatar";
import { useNavigate } from "react-router-dom";

interface Props {
  query: string;
  onSelect?: (contact: Contact) => void;
}

const SmartSuggestions = ({ query, onSelect }: Props) => {
  const [suggestions, setSuggestions] = useState<Contact[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      // ✅ Stop early
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8085/api/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        if (!Array.isArray(data)) {
          setSuggestions([]);
          return;
        }

        // ✅ FILTER LOCALLY
        const filtered = data.filter((c: Contact) =>
          c.name?.toLowerCase().includes(query.toLowerCase()) ||
          c.email?.toLowerCase().includes(query.toLowerCase()) ||
          c.phoneNumber?.includes(query)
        );

        setSuggestions(filtered.slice(0, 5));

      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
      {suggestions.map((c) => (
        <button
          key={c.id}
          onMouseDown={(e) => {
            e.preventDefault(); // ✅ prevents input blur

            if (onSelect) onSelect(c);
            else navigate(`/contacts/${c.id}`);
          }}
          className="flex items-center gap-3 w-full px-3 py-2 hover:bg-accent text-left"
        >
          <InitialsAvatar
            name={c.name}
            picture={c.picture}
            size="sm"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {c.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {c.email}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SmartSuggestions;




