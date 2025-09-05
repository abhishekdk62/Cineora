// constants/userRoutes/tickets.ts

const USER_TICKETS = {
  LIST: '/users/tickets' as const,
  CANCEL: '/users/cancel/ticket' as const,
};

export default USER_TICKETS;

export type UserTicketsRoutes = typeof USER_TICKETS;
