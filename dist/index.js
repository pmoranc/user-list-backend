"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
let data = {
    data: null
};
app.get('/', (req, res) => {
    res.send('Hi, thanks for the opportunity!');
});
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://reqres.in/api/users');
        data = response.data.data;
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
}));
app.post('/api/update-user', (req, res) => {
    const { id, first_name, last_name, email, avatar } = req.body;
    const updatedData = data.map((user) => {
        if (user.id === id) {
            return Object.assign(Object.assign({}, user), { first_name, last_name, email, avatar });
        }
        return user;
    });
    data = updatedData;
    res.json({ message: 'Data updated successfully', data });
});
app.put('/api/create-user', (req, res) => {
    const { first_name, last_name, email, avatar } = req.body;
    data.push({ id: data.length + 1, first_name, last_name, email, avatar });
    res.json({ message: 'Data updated successfully', data });
});
app.delete('/api/delete-user/:id', (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const updatedData = data.filter((user) => {
        return user.id !== numericId;
    });
    data = updatedData;
    res.json({ message: 'Data updated successfully', data });
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
