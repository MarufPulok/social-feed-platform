import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  className?: string;
  size?: number;
}

export default function UserAvatar({ user, className, size = 50 }: UserAvatarProps) {
  const initial = user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?";
  
  return (
    <Avatar 
      className={cn("relative shrink-0", className)} 
      style={{ width: size, height: size }}
    >
      <AvatarImage 
        src={user.avatar} 
        alt={`${user.firstName || ""} ${user.lastName || ""}`} 
        className="object-cover"
      />
      <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
        <span style={{ fontSize: Math.max(14, size * 0.4) }}>
          {initial}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
