export const USER_INVITE_GROUPS = {
  BASE: '/users/invite-groups',
  CREATE_GROUP: '/users/invite-groups',
  GET_GROUPS: '/users/invite-groups/available', 
  MY_INVITES: '/users/invite-groups/my-invites',
  JOIN_INVITE: '/users/invite-groups/confirm-join',
  LEAVE_INVITE: (inviteId: string) => `/users/invite-groups/${inviteId}/leave`,
  CANCEL_INVITE: (inviteId: string) => `/users/invite-groups/${inviteId}/cancel`,
  GET_BY_ID: (inviteId: string) => `/users/invite-groups/${inviteId}`, // ✅ Added missing route
};
