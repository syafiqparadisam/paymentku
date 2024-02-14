import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RefToken } from 'src/interfaces/refToken';
import { result } from 'src/interfaces/result';
import { ObjectId } from "mongodb"

@Injectable()
export class RefreshTokenService {
    constructor(
        @Inject("REF_TOKEN_MODEL")
        private rtModel: Model<RefToken>
    ) {
    }

    async insert(id: number, token: string): Promise<result> {
        const result = new this.rtModel({ id: id, refreshToken: token })
        try {
            await result.save()
            return { success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async insertJustUserId(refreshTokenId: any, user_id: number): Promise<result> {
        try {
            const data = await this.rtModel.updateOne({ _id: refreshTokenId }, { user_id })
            return { success: true }
        } catch (error) {
            return { success: false, data: error }
        }
    }

    async initAndFind(): Promise<result> {
        try {

            const newDocument = new this.rtModel()
            await newDocument.save()
            const findId = await this.rtModel.findOne({ _id: newDocument._id })
            return { success: true, data: findId }
        } catch (error) {
            return { success: false, data: error }
        }
    }
    async getIdRefreshTokenByUserId(userid: string): Promise<result> {
        try {
            const result = await this.rtModel.findOne({ user_id: userid })
            return { success: true, data: result }
        } catch (error) {
            return { success: false, data: error }
        }

    }

    async findTokenAndDelete(id: string, token: string): Promise<result> {
        try {
            await this.rtModel.updateOne({ _id: new ObjectId(id) }, { $pull: { refreshToken: token } })
            return { success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async findTokenFromToken(token: string): Promise<result> {
        try {
            const result = await this.rtModel.findOne({ refreshToken: token })
            return { data: result, success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async add(id: string, token: string): Promise<result> {
        try {
            const result = await this.rtModel.updateOne({ _id: new ObjectId(id) }, { $push: { refreshToken: token } })
            if (result.modifiedCount > 0) {
                return { success: true }
            } else if (result.modifiedCount == 0) {
                return { success: false }
            }
        } catch (error) {
            return { success: false, data: error }
        }
    }

    async findTokenById(id: string): Promise<result> {
        try {
            const result = await this.rtModel.findOne({ _id: id }, { id: 0, refreshToken: 1 })
            return { data: result, success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }

    }


    async deleteAllToken(id: number): Promise<result> {
        try {

            await this.rtModel.updateOne({ id }, { refreshToken: [] })
            return { success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async deleteToken(id: any, token: string): Promise<result> {
        console.log({ id, token })
        try {
            const result = await this.rtModel.updateOne({ _id: id }, { $pull: { refreshToken: token } })
            if (result.modifiedCount > 0) {
                return { success: true }
            } else if (result.modifiedCount == 0) {
                return { success: false }
            }
        } catch (error) {
            return { success: false, data: error }
        }
    }
}
