export default {
    dialect: 'postgresql',
    schema: './src/utils/schema.jsx',
    out: './drizzle',

    dbCredentials: {
        url: process.env.url,
        connectionString: process.env.connectionString
    },
}