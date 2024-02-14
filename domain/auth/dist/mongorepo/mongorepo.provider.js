"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const mongoose = require("mongoose");
exports.databaseProvider = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: () => {
            return mongoose.connect(process.env.MONGO_URL.toString());
        }
    }
];
//# sourceMappingURL=mongorepo.provider.js.map