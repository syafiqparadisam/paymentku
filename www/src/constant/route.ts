// export const route = new Map([
//     ["dashboard", "/dashboard"],
//     ["home", "/"],
//     ["signin", "/signin"],
//     ["signup", "/signup"],
//     ["topup", "/dashboard/topup"],
//     ["transfer", "/dashboard/transfer"],
//     ["user", "/dashboard/user"],
//     ["topuphistory", "/dashboard/user/history/topup"],
//     ["transferhistory", "/dashboard/user/history/transfer"],
//     ["settings", "/dashboard/user/settings"],
//     ["help", "/dashboard/user/help"],
//     ["forgotPassword", "/forgotPassword"]
// ])

export const route = {
    ["dashboard"]: "/dashboard",
    ["home"]: "/",
    ["signin"]: "/signin",
    ["signup"]: "/signup",
    ["transfer"]: "/dashboard/transfer",
    ["topup"]: "/dashboard/topup",
    ["user"]: "/dashboard/user",
    ["topuphistory"]: "/dashboard/user/history/topup",
    ["transferhistory"]: "/dashboard/user/history/transfer",
    ["settings"]: "/dashboard/user/settings",
    ["help"]: "/dashboard/user/help",
    ["forgotPassword"]: "/forgotPassword"
}

console.log(route)