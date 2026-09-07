"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const assets_route_1 = __importDefault(require("./routes/assets.route"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// console.log(db.update(usersTable).set({ avatar: 'https://i.pravatar.cc/150?img=32' }).then(data => console.log(data)));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_route_1.default);
app.use('/api/assets', assets_route_1.default);
app.listen(env_1.PORT, () => {
    console.log(`Server running on http://localhost:${env_1.PORT}`);
});
