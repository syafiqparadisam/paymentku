"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: console,
        cors: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, forbidNonWhitelisted: true, whitelist: true }));
    app.use(cookieParser());
    await app.listen(8800);
}
bootstrap();
//# sourceMappingURL=main.js.map