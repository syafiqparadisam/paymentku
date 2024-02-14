import * as mongoose from 'mongoose';

export const databaseProvider = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> => {
            return mongoose.connect(process.env.MONGO_URL.toString())
        }
    }
]
