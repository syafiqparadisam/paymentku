"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountNumber = void 0;
function generateAccountNumber() {
    return Math.floor(Math.random() * 9999999999) + 1;
}
async function createAccountNumber() {
    let accNumber;
    let userService;
    while (true) {
        const randNum = generateAccountNumber();
        const user = await userService.findByNumber(randNum);
        if (user.length === 0) {
            accNumber = randNum;
            break;
        }
    }
    return accNumber;
}
exports.createAccountNumber = createAccountNumber;
//# sourceMappingURL=CreateAccNumber.js.map