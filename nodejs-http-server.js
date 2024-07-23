const net = require("net");

const RES200 = "HTTP/1.1 200 OK";
const RES404 = "HTTP/1.1 404 Not Found";
const RES400 = "HTTP/1.1 400 Bad Request";

function handleResponse(reqLine, headers, request_body) {
    // Convert headers object to a string
    const headersString =
        `Content-Type: ${headers["Content-Type"]}\r\n` +
        `Content-Length: ${headers["Content-Length"]}\r\n`;

    // Create the full response
    const response = `${RES200}\r\n${headersString}\r\n${request_body}`;

    // Log the response for debugging
    console.log(`print response: ${response}`);
    return response;
}

function parseRequest(httpRequest, socket) {
    console.log(`Printing httpRequest...${httpRequest}`);
    let str = httpRequest.toString();
    const httpReq = str.split("\r\n");
    
    if (httpReq.length < 2) {
        return `${RES400}\r\n\r\n`;
    }

    // Get request line
    const reqLine = httpReq[0].split(" ");
    const request_target = reqLine[1];
    const request_body = request_target.slice(6);

    // Create headers object
    const headers = {
        "Content-Type": "text/plain",
        "Content-Length": `${request_body.length}`,
    };

    // Return response
    if (request_target === "/") {
        const headersString =
            `Content-Type: ${headers["Content-Type"]}\r\n` + 
            `Content-Length: ${headers["Content-Length"]}\r\n`;
        return `${RES200}\r\n${headersString}\r\n\r\n`;
    } else if (request_target.startsWith("/echo")) {
        return handleResponse(reqLine, headers, request_body);
    } else {
        return `${RES404}\r\n\r\n`;
    }
}

function handleConn(httpRequest, socket) {
    const req = parseRequest(httpRequest);
    console.log("returned from parseRequest...");
    console.log(req);

    // Send the response as binary data
    socket.write(Buffer.from(req));
    socket.end();
}

const server = net.createServer((socket) => {
    console.log("Logs from your program will appear here!");
    socket.on("data", (data) => {
        handleConn(data, socket);
    });
    socket.on("close", () => {
        socket.end();
    });
});
server.on("error", (err) => {
    console.error(err);
});
server.listen(4221, "localhost");
