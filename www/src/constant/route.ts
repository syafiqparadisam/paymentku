export const route = {
  dashboard: "/dashboard",
  signin: "/signin",
  home: "/",
  forgotPassword: "/forgotPassword",
  transferhistory: "/dashboard/user/history/transfer",
  topuphistory: "/dashboard/user/history/topup",
  transfer: "/dashboard/transfer",
  topup: "/dashboard/topup",
  signup: "/signup",
  help: "/dashboard/user/help",
  settings: "/dashboard/user/settings",
  user: "/dashboard/user",
  maintenance: "/maintenance",
  passwordReset: "/passwordReset*"
};

export const excludeRedirectRouteWhenUnauth = [
  route["signin"],
  route["forgotPassword"],
  route["signup"],
  route["home"],
  route["passwordReset"]
];
