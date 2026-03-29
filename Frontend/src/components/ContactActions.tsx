import { MessageCircle, Mail, Phone as PhoneIcon } from "lucide-react";

interface Props {
  phone?: string;
  email?: string;
  name?: string;
  onContacted?: () => void;
}

const ContactActions = ({ phone, email, name, onContacted }: Props) => {
  const handleWhatsApp = () => {
    if (!phone) return;
    const cleaned = phone.replace(/[\s\-()]/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
    onContacted?.();
  };

  const handleEmail = () => {
    if (!email) return;
    window.open(`mailto:${email}?subject=Hello ${name || ""}`, "_blank");
    onContacted?.();
  };

  const handleCall = () => {
    if (!phone) return;
    window.open(`tel:${phone}`, "_self");
    onContacted?.();
  };

  return (
    <div className="flex items-center gap-1">
      {phone && (
        <>
          <button
            onClick={handleWhatsApp}
            title="WhatsApp"
            className="p-1.5 rounded-md hover:bg-green-500/10 transition-colors"
          >
            <MessageCircle size={14} className="text-green-500" />
          </button>
          <button
            onClick={handleCall}
            title="Call"
            className="p-1.5 rounded-md hover:bg-primary/10 transition-colors"
          >
            <PhoneIcon size={14} className="text-primary" />
          </button>
        </>
      )}
      {email && (
        <button
          onClick={handleEmail}
          title="Email"
          className="p-1.5 rounded-md hover:bg-warning/10 transition-colors"
        >
          <Mail size={14} className="text-warning" />
        </button>
      )}
    </div>
  );
};

export default ContactActions;
