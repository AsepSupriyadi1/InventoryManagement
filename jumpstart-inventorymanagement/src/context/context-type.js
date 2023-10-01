export const user_type = {
  userId: "",
  email: "",
  fullName: "",
  address: "",
  userRole: "",
  phoneNumber: "",
  outletId: "",
};

// USER CONTEXT
export const context_user = {
  currentUser: user_type,
  isLoggedIn: false,
  token: "",
  login: (token) => {},
  logout: () => {},
};
