import * as mongoose from "mongoose";


export const RefreshTokenSchema = new mongoose.Schema({
    user_id: Number,
    refreshToken: [String]
})

export interface RtSchema {
    user_id: Number,
    refreshToken: []
}