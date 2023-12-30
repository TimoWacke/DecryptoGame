const express = require('express');
const cors = require('cors');
const app = express();

// middleware function with next
app.use(function (req, res, next) {
    next()
})

app.use(cors());
app.use(express.json());


const gameRouter = require('./routes/game');
const userRouter = require('./routes/user');

app.use('/game', gameRouter);
app.use('/user', userRouter);

const port = 1234
app.listen(port, () => console.log('Decrypto API is running on port: ' + port));

