import React from "react";
import { GroupInvite } from "./GroupInvitesManager";
import MyInviteCard from "./MyInviteCard";

interface Props {
  invites: GroupInvite[];
  onCopyLink: (inviteId: string) => void;
  onRefresh: () => void;
  handleCancel: (inviteId: string) => void;
}

const MyInvitesSection: React.FC<Props> = ({ 
  invites, 
  onCopyLink, 
  onRefresh, 
  handleCancel 
}) => {
  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <MyInviteCard
          key={invite._id}
          invite={invite}
          onCopyLink={onCopyLink}
          onRefresh={onRefresh}
          handleCancel={handleCancel}
        />
      ))}
    </div>
  );
};

export default MyInvitesSection;
