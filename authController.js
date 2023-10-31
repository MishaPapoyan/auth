const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const { secret } = require("./config")

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: "Ошибка при регистрации", errors })
			}
			const { username, lastname, password, email, color } = req.body;
			const candidate = await User.findOne({ username })
			if (candidate) {
				return res.status(400).json({ message: "Пользователь с таким mail уже существует" })
			}
			const hashPassword = bcrypt.hashSync(password, 7);
			const userRole = await Role.findOne({ value: "USER" })
			const user = new User({ username, lastname, email, color, password: hashPassword, roles: [userRole.value] })
			await user.save()
			return res.json({ message: "Пользователь успешно зарегистрирован" })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'Registration error' })
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body
			const user = await User.findOne({ username })
			if (!user) {
				return res.status(400).json({ message: `Пользователь ${username} не найден` })
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({ message: `Введен неверный пароль` })
			}
			const token = generateAccessToken(user._id, user.roles)
			return res.json({ token, user })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'Login error' })
		}
	}

	async get_current_user(req, res) {
		try {
			const { username } = req.body;
			const user = await User.findOne({ username });

			if (user) {
				res.json({ user })
			} else {
				return res.status(404).json({ message: 'User not found' });
			}
		} catch (e) {
			console.log(e);
			res.status(400).json({ message: 'Login error' });
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find()
			res.json(users)
		} catch (e) {
			console.log(e)
		}
	}
	async save_data_in_server(req, res) {
		try {
			const requestData = req.body;
			const currentDate = Object.keys(requestData)[0];
			console.log(`Received data for date: ${currentDate}`);
			console.log('Data:', requestData[currentDate]);

			res.status(200).send('Data received successfully.');
		} catch (e) {
			console.log(e);
			res.status(400).json({ message: 'error' });
		}
	}


}

module.exports = new authController()
