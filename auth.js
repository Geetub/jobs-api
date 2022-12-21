const jwt = require("jsonwebtoken");
const TOKEN_KEY = "SOME_KEY" // move to config

var users =
    [
        { email: 'bob@gmail.com' },
        { email: 'mike@gmail.com' },
        { email: 'erik@gmail.com' },
        { email: 'zelda@gmail.com' }
    ]


async function login(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("Missing input");
        }

        const user = await users.find(u => u.email == email);
        // if (user && (await bcrypt.compare(password, user.password))) 
        if (user) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                'SOME_KEY',
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
}

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };

module.exports.login = login;
module.exports.verifyToken = verifyToken;