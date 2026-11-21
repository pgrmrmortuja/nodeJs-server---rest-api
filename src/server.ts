import { createServer, IncomingMessage, Server, ServerResponse } from "http";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    // console.log("Request Is: ",req);
    // console.log("Response Is: ",res);
    // console.log(req.url);
    // console.log(req.method);

    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        // console.log("This is Root Route.");

        // res.writeHead(200, {
        //     "content-type": "text/plain"
        // });

        // res.end("This is Root Route");

        res.writeHead(200, {
            "content-type": "application/json"
        });

        //! res.end({message: "This is Root Route."}); //server will crashed, tcp don't take chunk by chunk data

        res.end(JSON.stringify({
            "message": "This is Root Route."
        }))
    } else if (url?.startsWith("/products")) {
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.end(JSON.stringify({
            "message": "This is Product Route."
        }))
    }
    else {
        // console.log("This Route is not Defined.");

        // res.writeHead(404, {
        //     "content-type": "text/plain"
        // });
        // res.end("This Route is not Defined");

        res.writeHead(404, {
            "content-type": "application/json"
        });

        res.end(JSON.stringify({
            "message": "This Route is Not Defined"
        }));
    }
})

server.listen(5000, () => {
    console.log("Server is running");
})