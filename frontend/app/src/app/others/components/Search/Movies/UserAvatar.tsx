import { Lexend } from "next/font/google";

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface User {
  _id: string;
  email: string;
  username: string;
  profilePicture?: string;
}

interface UserAvatarProps {
  user: User;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
      {user.profilePicture ? (
        <img 
          src={user.profilePicture} 
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={`${lexendMedium.className} text-white text-sm`}>
          {getInitials(user.email)}
        </span>
      )}
    </div>
  );
}
