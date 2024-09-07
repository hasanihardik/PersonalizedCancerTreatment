export default {
    dialet: 'postgresql',
    schema: './src/utils/schema.jsx',
    out: './drizzle',

    dbCredentials: {
        url: 'import.meta.env.url',
        connectionString: 'import.meta.env.connectionString'
    },
}