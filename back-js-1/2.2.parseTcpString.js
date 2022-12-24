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


/** a piece of code from a tutorial */

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

http = parseTcpStringAsHttpRequest(contents)
console.log(JSON.stringify(http, undefined, 2))

/** a piece of code from a tutorial */