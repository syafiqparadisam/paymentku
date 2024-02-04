import { Document } from "mongoose";


export interface RefToken extends Document {
    readonly id: number;
    readonly refreshToken: [String];
  }
  