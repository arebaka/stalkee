module.exports = {
    token:  process.env.TOKEN,
    params: {},
    admin: {
        id: process.env.ADMIN_ID
    },
    db: {
        host:     process.env.DBHOST     || "localhost",
        user:     process.env.DBUSER     || null,
        password: process.env.DBPASSWORD || null,
        database: process.env.DBDATABASE,
        port:     process.env.DBPORT     || 5432
    },
    responseLimit: process.env.RESPONSE_LIMIT || 50,
};
