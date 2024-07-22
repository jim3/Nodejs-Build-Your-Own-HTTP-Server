const net = require("net");

function parseRequest(httpRequest, socket) {
    console.log(`Printing httpRequest...${httpRequest}`);
    let str = httpRequest.toString();
    console.log("bufferToStr: ", typeof str);
    const httpReq = str.split("\r\n");
    const reqLine = httpReq[0].split(" ");
    const request_target = reqLine[1];
    // console.log("request_target: ", request_target);

    if (request_target === "/") {
        return "HTTP/1.1 200 OK\r\n\r\n";
    } else {
        return "HTTP/1.1 404 Not Found\r\n\r\n";
    }
}

// --------------------------------------------- //

function handleConn(httpRequest, socket) {
    const req = parseRequest(httpRequest);
    console.log("returned from parseRequest:", req);
    socket.write(req);
    socket.end();
}

// --------------------------------------------- //

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
