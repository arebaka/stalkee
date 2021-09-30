module.exports = {
    token:  process.env.TOKEN,
    params: {},
    admin: {
        id: process.env.ADMIN_ID
    },
    dbUri: process.env.DBURI,
    responseLimit: process.env.RESPONSE_LIMIT || 50
};
