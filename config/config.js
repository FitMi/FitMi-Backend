module.exports = {
	'app_secret': process.env.APP_SECRET,
  'db_uri': process.env.DB_URI || 'mongodb://localhost:27017/FitMe',
  'db_options': {
    'user': process.env.DB_USER || '',
    'pass': process.env.DB_PWD || ''
  },
  'facebook_clientid': process.env.FACEBOOK_CLIENTID,
  'facebook_secret': process.env.FACEBOOK_SECRET
};
