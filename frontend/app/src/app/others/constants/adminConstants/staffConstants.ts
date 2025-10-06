

const ADMIN_STAFF = {
  GET_STAFF:  `/admin/staff`,
  TOGGLE_STATUS:(staffId:string)=>  `/admin/staff/${staffId}`,
};

export default ADMIN_STAFF;

export type AdminOwnersRoutes = typeof ADMIN_STAFF;
