import * as mongoose from 'mongoose';

export const databaseProvider = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> => {
            return mongoose.connect("mongodb+srv://mongotutorial:return500@cluster0.u6antwt.mongodb.net/?retryWrites=true&w=majority")
        }
    }
]
