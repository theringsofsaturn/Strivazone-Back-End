import express from 'express';
import listEndpoints from "express-list-endpoints";
import productsRouter from "./services/products.js";
import reviewsRouter from "./services/reviews.js";
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorHandlers.js"
import cors from "cors";

// *********************** GLOBAL MIDDLEWARES *********************

// ************************ CORS **********************

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL]
const corsOpts = {
  origin: function (origin, next) {
    // Since CORS is a global middleware, it is going to be executed for each and every request --> we are able to "detect" the origin of each and every req from this function
    console.log("CURRENT ORIGIN: ", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If origin is in the whitelist or if the origin is undefined () --> move ahead
      next(null, true)
    } else {
      // If origin is NOT in the whitelist --> trigger a CORS error
      next(new Error("CORS ERROR"))
    }
  },
}

const server = express();

server.use(cors(corsOpts)); // You need this if you want to make the FE communicate with BE
server.use(express.json()) // If I do NOT specify this line BEFORE the endpoints, all the requests' bodies will be UNDEFINED


// ************************ ENDPOINTS **********************
server.use("/products", productsRouter)
server.use("/reviews", reviewsRouter)

// *********************** ERROR MIDDLEWARES ***************************

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

const port = process.env.PORT // check if dotenv package is installed and USED ( -r dotenv/config)

// *********************** THE TREE TABLE ***************************
console.table(listEndpoints(server))

// *********************** THE SERVER LISTENING TO THE PORT ***************************
server.listen(port, () => console.log("listening on port:", port))

server.on('error', (err) => console.log(err))