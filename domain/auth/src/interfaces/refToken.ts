import { Document } from "mongoose";


export interface RefToken extends Document {
    user_id: number;
    refreshToken: [String];
  }
  