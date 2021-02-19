module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://filipp_test:HhGjKu5OFPHr6kAb@cluster0.edzxj.mongodb.net/checklist',
  PORT: process.env.PORT || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'RESTFULAPIs',
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '1h',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'RESTFULAPIs',
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || '24h'
}