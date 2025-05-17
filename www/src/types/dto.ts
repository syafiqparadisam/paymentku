
export type SignUpInput = {
    user: string
    email: string
    password: string
}

export type SignInInput = {
    user: string,
    password: string
}

export type Profile = {
    username: string,
    password: string,
    name: string,
    email: string,
    avatar: string,
    balance: string,
    bio: string,
    phoneNumber: string,
    accountNumber: string
}

export type ForgotPassword = {
    token: string,
    password: string,
    confirmPassword: string
}

export type SendEmail = {
    email: string,
}

export type TopUp = {
    amount: number
}

export type VerifyPassword = {
    password: string
}

export type Transfer = {
    accountNumber: number,
    notes?: string,
    amount: number
}

