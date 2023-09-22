export const user_type = {
  userId: "",
  email: "",
  fullName: "",
  address: "",
  userRole: "",
  phoneNumber: "",
};

// USER CONTEXT
export const context_user = {
  currentUser: user_type,
  isLoggedIn: false,
  token: "",
  login: (token) => {},
  logout: () => {},
};
