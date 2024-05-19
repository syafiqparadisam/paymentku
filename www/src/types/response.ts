export interface Response<T> {
    statusCode: number,
    data: T | null,
    message: string
}

export interface User {
    user: string
    email: string
    balance: number
    photo_profile: string
    photo_public_id: string | null
    accountNumber: number
    name: string
    created_at: string
    bio: string
    phoneNumber: string
}

export interface FindUserByAccount {
    user: string,
    photo_profile: string,
    accountNumber: number,
    created_at: string,
    name: string,
}

export interface UserFound {
    user: string,
    accountNumber: number,
    created_at: string,
    name: string,
    bio: string,
    photo_profile: string,
}

export interface HistoryTopUps {
    id: number,
    amount: number,
    isRead: boolean,
    status: "SUCCESS" | "FAILED",
    createdAt: string
}


export interface HistoryTopUp {
    id: number,
    amount: number,
    balance: number,
    previousBalance: number,
    isRead: boolean,
    status: "SUCCESS" | "FAILED",
    createdAt: string
}

export interface HistoryTransfers {
    id: number,
    sender: string,
    receiver: string,
    amount: number,
    isRead: boolean,
    status: "SUCCESS" | "FAILED",
    createdAt: string
}

export interface HistoryTransfer {
    id: number,
    sender: string,
    receiver: string,
    notes: string,
    senderName: string,
    previousBalance: number,
    balance: number,
    receiverName: string,
    amount: number,
    isRead: boolean,
    status: "SUCCESS" | "FAILED",
    createdAt: string
}