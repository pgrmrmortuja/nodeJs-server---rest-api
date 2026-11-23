import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import routeHandler from "./routes/route";
import config from "./config";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    routeHandler(req , res);
})

// server.listen(5000, () => {
//     console.log("Server is running");
// })

server.listen(config.port , () => {
    console.log(`Server is running on the port ${config.port}`)
})