function readHttpLikeInput() {
    var fs = require("fs")
    var res = ""
    var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1)
    let was10 = 0
    for (; ;) {
        try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1) } catch (e) { break /* windows */ }
        if (buffer[0] === 10 || buffer[0] === 13) {
            if (was10 > 10)
                break
            was10++
        } else
            was10 = 0
        res += new String(buffer)
    }

    return res
}

let contents = readHttpLikeInput()

function outputHttpResponse(statusCode, statusMessage, headers, body) {
    let response = []
    response.push(
        "HTTP/1.1 " + statusCode,
        "Date: " + new Date(Date.now()).toUTCString(),
        "Server: Apache/2.2.14 (Win32)",
        "Content-Length: " + statusMessage.toString().length,
        "Connection: Closed",
        "Content-Type: text/html; charset=utf-8",
        "\n" + statusMessage
    )
    console.log(response.join("\n"))
}

function processHttpRequest($method, $uri, $headers, $body) {
    let statusCode, statusMessage

    if ($method == "GET" && $uri.match(/\/sum\?nums\=[\d,]*\d/i)) {
        statusMessage = $uri.split("=")[1].split(",").reduce((a, b) => a * 1 + b * 1)
        statusCode = "200 OK"
    } else if ($method == "GET" && !$uri.match(/\/sum/i)) {
        statusMessage = "not found"
        statusCode = "404 Not Found"
    } else if ($method != "GET" || !$uri.match(/\?nums\=/i)) {
        statusMessage = "bad request"
        statusCode = "400 Bad Request"
    }

    outputHttpResponse(statusCode, statusMessage, $headers, $body)
}

function parseTcpStringAsHttpRequest(string) {

    return string
        .split("\n")
        .reduce(
            (result, current, indx, array) => {
                if (current.match(/POST|GET/i)) {
                    let buffer = current.split(" ")
                    result.method = buffer[0]
                    result.uri = buffer[1]
                } else if (current.match(/Accept|User-Agent|Content-Length/i)) {
                    let buffer = current.split(":")
                    result.headers[buffer[0]] = buffer[1]
                } else if (!current.length && array[indx + 1] && array[indx + 1].length) {
                    result.body = array[indx + 1]
                }
                return result
            },
            {
                method: "",
                uri: "",
                headers: {},
                body: "",
            }
        )
}

http = parseTcpStringAsHttpRequest(contents)
processHttpRequest(http.method, http.uri, http.headers, http.body)