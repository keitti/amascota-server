const mysql = require("mysql2");

const createConnection = mysql.createPool({
    host: 'bhkngzbfwa0pfkqzlzxp-mysql.services.clever-cloud.com',
    user: 'ujvotfhsfainnasb',
    password: 'GrOxV735yG7tQ7sYpWp7',
    database: 'bhkngzbfwa0pfkqzlzxp',
    port: 3306
});
const promisePool = createConnection.promise();
module.exports = promisePool;
