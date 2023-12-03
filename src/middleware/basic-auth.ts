import config from "../configs/config";

const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Access denied. No credentials provided.');
    }

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    if (username === config.secrets.user && password === config.secrets.pass) {
        next();
    } else {
        res.status(401).send('Access denied. Invalid credentials.');
    }
};

export default basicAuth;