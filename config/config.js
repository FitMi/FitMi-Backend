module.exports = {
  db_uri: process.env.DB_URI || 'mongodb://localhost:27017/FitMe',
  db_options: {
    user: process.env.DB_USER || '',
    pass: process.env.DB_PWD || ''
  }
};
