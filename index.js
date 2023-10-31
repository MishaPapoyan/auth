const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const app = express();

const corsOptions = {
	origin: '*', // You can set this to the specific origin you want to allow.
	credentials: true,
	optionsSuccessStatus: 200,
};

// Enable CORS with the provided options
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", authRouter);

const start = async () => {
	try {
		await mongoose.connect("mongodb+srv://MishaPapoyan:QWERTY123456@cluster0.d221irq.mongodb.net/load_system_users?retryWrites=true&w=majority")
		app.listen(PORT, () => console.log(`server started on port ${PORT}`))
	} catch (e) {
		console.log(e);
	}
}

start();

