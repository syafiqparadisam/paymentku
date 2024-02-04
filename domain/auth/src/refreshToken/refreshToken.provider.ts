import { Connection } from "mongoose"
import { RefreshTokenSchema } from "./schemas/refreshToken.schema"

export const RefreshTokenProviders = [
    {
        provide: "REF_TOKEN_MODEL",
        useFactory: (connection: Connection) => connection.model("REFRESH_TOKEN", RefreshTokenSchema),
        inject: ["DATABASE_CONNECTION"],
    },
]