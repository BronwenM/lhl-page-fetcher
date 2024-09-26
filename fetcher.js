const fs = require("fs");
const net = require("net");

const userInput = process.argv.slice(2);
const url = userInput[0].replace('http://www.', '').replace('/','');
let filePath = '';
//decide where the file will be written to.
const regexFileExtension = "(html)|(js)|(css)|(json)/g"
const fileExtension = userInput[1].match(regexFileExtension)[0];

if(fs.existsSync(userInput[1])) filePath = userInput[1].replace(`.${fileExtension}`, `-copy.${fileExtension}`);
else filePath = userInput[1];

console.log(filePath)

const conn = net.createConnection({
    host: url,
    port: 80
});
conn.setEncoding('UTF8');

conn.on('connect', () => {
    console.log(`Connected to server!`);

    conn.write(`GET / HTTP/1.1\r\n`);
    conn.write(`Host: ${url}\r\n`);
    conn.write(`\r\n`);
});

/** 
 * HTTP Response
 * After request is made, the HTTP server should send us HTTP data via our TCP connection
 * Print the data to the screen, and end the connection
 */
conn.on('data', (data) => {
    fs.writeFile(filePath, data, (err) => {
        if(err) console.log("Error Alert!", err);
        else {
            console.log(`Data from ${url} successfully written to ${filePath}`);
        }
    });
    conn.end();
});