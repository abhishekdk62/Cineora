import React from "react";
import { GroupInvite } from "./GroupInvitesManager";
import BrowseInviteCard from "./BrowseInviteCard";

interface Props {
  invites: GroupInvite[];
  onJoin: (inviteId: string) => void;
  onRefresh: () => void;
}

const BrowseInvitesSection: React.FC<Props> = ({ invites, onJoin, onRefresh }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invites.map((invite) => (
        <BrowseInviteCard
          key={invite._id}
          invite={invite}
          onJoin={onJoin}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};

export default BrowseInvitesSection;
