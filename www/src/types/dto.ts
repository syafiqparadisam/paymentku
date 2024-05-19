
export interface SignUpInput {
    user: string
    email: string
    password: string
}

export interface SignInInput {
    user: string,
    password: string
}

export interface Profile {
    username: string,
    password: string,
    name: string,
    email: string,
    avatar: string,
    balance: number,
    bio: string,
    phoneNumber: string,
    accountNumber: string
}

export interface ForgotPassword {
    token: string,
    password: string,
    confirmPassword: string
}

export interface SendEmail {
    email: string,
}

export interface TopUp {
    amount: number
}

export interface VerifyPassword {
    password: string
}

export interface Transfer {
    accountNumber: number,
    notes?: string,
    amount: number
}

