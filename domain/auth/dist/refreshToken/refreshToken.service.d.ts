/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { RefToken } from 'src/interfaces/refToken';
import { result } from 'src/interfaces/result';
export declare class RefreshTokenService {
    private rtModel;
    constructor(rtModel: Model<RefToken>);
    insert(id: number, token: string): Promise<result>;
    insertJustUserId(refreshTokenId: any, user_id: number): Promise<result>;
    initAndFind(): Promise<result>;
    getIdRefreshTokenByUserId(userid: string): Promise<result>;
    findTokenAndDelete(id: string, token: string): Promise<result>;
    findTokenFromToken(token: string): Promise<result>;
    add(id: string, token: string): Promise<result>;
    findTokenById(id: string): Promise<result>;
    deleteAllToken(id: number): Promise<result>;
    deleteToken(id: any, token: string): Promise<result>;
}
