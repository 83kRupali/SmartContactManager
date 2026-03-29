import { AlertTriangle } from "lucide-react";
import { Contact } from "@/types/contact";

interface Props {
  emailDup?: Contact;
  phoneDup?: Contact;
}

const DuplicateWarning = ({ emailDup, phoneDup }: Props) => {
  if (!emailDup && !phoneDup) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2 text-warning font-medium text-sm">
        <AlertTriangle size={16} />
        Duplicate Detected
      </div>
      {emailDup && (
        <p className="text-xs text-muted-foreground">
          Email already exists: <strong>{emailDup.name}</strong> ({emailDup.email})
        </p>
      )}
      {phoneDup && (
        <p className="text-xs text-muted-foreground">
          Phone already exists: <strong>{phoneDup.name}</strong> ({phoneDup.phoneNumber})
        </p>
      )}
    </div>
  );
};

export default DuplicateWarning;
