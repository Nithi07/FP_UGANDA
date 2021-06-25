module.exports = {
  dbPool: {
    user: process.env.USER || 'fhop',
    password: process.env.PASSWORD ||'p@ssw0rd',
    connectString: process.env.CONNECTIONSTRING || '192.168.61.5:1521/UAT',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  },
};
