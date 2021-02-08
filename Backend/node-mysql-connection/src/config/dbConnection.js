const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'bvj4hzascbyeihgwfuro-mysql.services.clever-cloud.com',
        user: 'uplra52v1r71g0of',
        password: '08iflEp2vPo7nAKAUiGV',
        database: 'bvj4hzascbyeihgwfuro' 
    });

}