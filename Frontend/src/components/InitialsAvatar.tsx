import { getInitialsAvatar } from "@/lib/contacts";

const colors = [
  "bg-primary", "bg-success", "bg-warning", "bg-destructive",
  "bg-purple-500", "bg-pink-500", "bg-teal-500", "bg-orange-500",
];

interface Props {
  name: string;
  picture?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-24 h-24 text-2xl",
};

const InitialsAvatar = ({ name, picture, size = "sm", className = "" }: Props) => {
  if (picture) {
    return <img src={picture} alt={name} className={`${sizeMap[size]} rounded-full object-cover ${className}`} />;
  }

  const initials = getInitialsAvatar(name);
  const colorIdx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;

  return (
    <div className={`${sizeMap[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center text-white font-bold ${className}`}>
      {initials}
    </div>
  );
};

export default InitialsAvatar;
