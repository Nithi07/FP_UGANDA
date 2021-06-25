module.exports = {
  dbPool: {
    user: process.env.USER || 'fp_uganda',
    password: process.env.PASSWORD || 'fp_uganda',
    connectString: process.env.CONNECTIONSTRING || '192.168.61.5:1521/uat',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
  },
};
