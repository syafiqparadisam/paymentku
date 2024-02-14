import * as mongoose from "mongoose";


export const RefreshTokenSchema = new mongoose.Schema({
    refreshToken: [String]
})

export interface RtSchema {
    refreshToken: []
}