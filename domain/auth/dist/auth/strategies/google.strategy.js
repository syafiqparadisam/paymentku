"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth2_1 = require("passport-google-oauth2");
class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth2_1.Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:8800/auth/login/google",
            scope: ["profile", "email"]
        });
    }
    async validate(_accessToken, _refreshToken, profile, done) {
        console.log(profile);
        const user = {
            provider: "google",
            providerID: profile.id,
            username: profile.username,
            email: profile.emails[0].value,
            name: profile.fullname,
            picture: profile.photos[0].value,
        };
        console.log(user);
        done(null, user);
    }
}
exports.GoogleStrategy = GoogleStrategy;
//# sourceMappingURL=google.strategy.js.map