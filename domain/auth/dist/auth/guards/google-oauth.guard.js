"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOauthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class GoogleOauthGuard extends (0, passport_1.AuthGuard)('google') {
}
exports.GoogleOauthGuard = GoogleOauthGuard;
//# sourceMappingURL=google-oauth.guard.js.map