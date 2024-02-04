import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RefToken } from 'src/interfaces/refToken';
import { RtSchema } from './schemas/refreshToken.schema';

interface result {
    data?: any,
    success: boolean,
}


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
            return {success: false}
        }
    }

    async findTokenAndDelete(id: number, token: string): Promise<result> {
        try {
            await this.rtModel.updateOne({ id }, { $pull: { refreshToken: token } })
            const user = await this.rtModel.findOne({ id }, { refreshToken: 1, id: 0 })
            return { data: user, success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async findTokenFromToken(token: string): Promise<result> {
        try {
            const result = await this.rtModel.findOne({ refreshToken: token }, { id: 0, refreshToken: 1 })
            return { data: result, success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async add(id: number, token: string[]): Promise<result> {
        const result = await this.rtModel.updateOne({ id }, { $push: { refreshToken: { $each: token } } })
        if (result.modifiedCount > 0) {
            return { success: true }
        } else if (result.modifiedCount == 0) {
            return { success: false }
        }
    }

    async findTokenById(id: number): Promise<result> {
        try {
            const result = await this.rtModel.findOne({ id }, { id: 0, refreshToken: 1 })
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

    async deleteToken(id: number, token: string): Promise<result> {
        const result = await this.rtModel.updateOne({ id }, { $pull: { refreshToken: token } })
        if (result.modifiedCount > 0) {
            return { success: true }
        } else if (result.modifiedCount == 0) {
            return { success: false }
        }
    }
}
