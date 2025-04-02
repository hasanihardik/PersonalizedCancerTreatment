export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.jsx",
  out: "./drizzle",

  dbCredentials: {
    url: process.env.VITE_DATABASE_URL,
    connectionString: process.env.VITE_DATABASE_URL,
  },
};
