import express from "express";

import cors from "cors";

import listEndpoints from "express-list-endpoints";

import authorsRouter from "./authors/index.js";

import blogsRouter from "./blogs/index.js";

import { notFound, forbidden, catchAllErrorHandler } from "./errorHandlers.js";

import path, { dirname } from "path";

import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const publicDirectory = path.join(__dirname, "../public");

const server = express();

const PORT =  process.env.PORT || 3001;

const whitelist = [ process.env.FRONTEND_URL, process.env.FRONTEND_PROD_URL]

// if cors origin key prpoerty value is empty or null or cannot be found within whitelist return null otherwise return true
// server.use(cors({origin:'https://localhost:3000'}))
//this would allow request to be made by https://localhost:3000'

server.use(cors({

  origin: (origin, callback) => {
    console.log({origin})
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // origin is in the list therefore it is allowed
      callback(null, true)
    } else {
      // origin is not in the list then --> ERROR
      callback(new Error("Not allowed by cors!"))
    }
  },
})
) 



// CROSS ORIG)) 


 

server.use(express.json());

server.use(express.static(publicDirectory));

server.use("/authors", authorsRouter);

server.use("/blogs", blogsRouter);

server.use(notFound);

server.use(forbidden);

server.use(catchAllErrorHandler);

console.table(listEndpoints(server));

server.listen(PORT, () => console.log("✅ Server is running on port : ", PORT));

server.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)
);
