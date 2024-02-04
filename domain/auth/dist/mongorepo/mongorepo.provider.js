"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const mongoose = require("mongoose");
exports.databaseProvider = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: () => {
            return mongoose.connect("mongodb+srv://mongotutorial:return500@cluster0.u6antwt.mongodb.net/?retryWrites=true&w=majority");
        }
    }
];
//# sourceMappingURL=mongorepo.provider.js.map