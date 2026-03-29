
import { motion } from "framer-motion";
import { Mail, Phone, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  phoneNumber?: string;
  about?: string;
  profilePic?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ LOAD USER FROM LOCAL STORAGE
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  }, []);

  // ⛔ Loading state
  if (!user) {
    return (
      <p className="p-6 text-center text-muted-foreground">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated text-center"
      >
        {/* Profile Image */}
        <img
          src={user.profilePic || "https://i.pravatar.cc/150?img=12"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-background shadow-lg"
        />

        {/* Name + About */}
        <h2 className="text-xl font-bold text-foreground mt-3">
          {user.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {user.about || "No description available"}
        </p>

        {/* Info Section */}
        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Mail size={16} className="text-primary" />
            <span className="text-sm text-foreground">
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Phone size={16} className="text-primary" />
            <span className="text-sm text-foreground">
              {user.phoneNumber || "Not provided"}
            </span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <Shield
              size={14}
              className={
                user.emailVerified
                  ? "text-success"
                  : "text-muted-foreground"
              }
            />
            <span
              className={
                user.emailVerified
                  ? "text-success"
                  : "text-muted-foreground"
              }
            >
              Email {user.emailVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield
              size={14}
              className={
                user.phoneVerified
                  ? "text-success"
                  : "text-muted-foreground"
              }
            />
            <span
              className={
                user.phoneVerified
                  ? "text-success"
                  : "text-muted-foreground"
              }
            >
              Phone {user.phoneVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;