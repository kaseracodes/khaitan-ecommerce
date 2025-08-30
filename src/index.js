const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const responseTime = require('response-time');

const {PORT, DB_ALTER, DB_FORCE, NODE_ENV} = require('./config/server_config');
const ApiRouter = require('./routes/api_router');

const db = require('./config/db_config');
const { syncDbInOrder } = require('./models');
const { accessControlCache } = require("./cache");
const { registerHooks } = require('./models/hooks');

// Define all allowed frontend origins
const allowedOrigins = [
    'http://localhost:5173',
  
    // CloudFront deployments
    'https://d57ts81kncgja.cloudfront.net',     // user site
    'https://d1x5ux3yxrkwei.cloudfront.net',     // admin site
  
    // Custom domains 
    // www.khaitan.com is an alias (CNAME) for khaitan.com, and it also resolves the same IP address
    'https://khaitan.com',
    'https://www.khaitan.com',
    'https://admin.khaitan.com',
    'https://www.admin.khaitan.com',
];

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Allow no-origin requests (Postman, server-to-server, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true,
}));

app.use((err, req, res, next) => {
    if (err.message && err.message.startsWith("Not allowed by CORS")) {
      console.warn("Blocked CORS request from:", req.headers.origin);
      return res.status(403).send("CORS Error: Not allowed");
    }
    next(err);
});

// app.use(responseTime(function f(req, res, time) {
//     console.log("Time elapsed = ", time);
//     res.setHeader('X-Response-Time', time);
// }));
app.use(responseTime());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', ApiRouter); // if any req comes with url starting with /api

app.listen(PORT, async () => {
    console.log(`Server for Khaitan Ecommerce is Up ${PORT}`);
    if(NODE_ENV == 'development') {
        if(DB_FORCE == true) {
            await db.sync({ force: true});
            console.log("Database synced with `force: true`");
        } else if (DB_ALTER == true) {
            await db.sync({ alter: true});
            console.log("Database synced with `alter: true`");
        } else {
            await db.sync();
            console.log("Database synced without force or alter");
        }
    }
    if(NODE_ENV == 'production') {
        console.log("Syncing db in order");
        syncDbInOrder();
    }
   
    console.log('DB Connected');
    await accessControlCache.syncCache();
    registerHooks();

    // const c = await Category.findByPk(2);

    // console.log(c);

    // const p = await c.countProducts();

    // console.log(p);

    // const user = await User.findByPk(16);
    // console.log(user);

    // const cart = await user.getCart();

    // console.log(cart);

    // const cart = await Cart.findByPk(1);
    // const products = await cart.getProducts();
    // console.log(products[0].cart_products);
})