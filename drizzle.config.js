export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.jsx",
  out: "./drizzle",
  dbCredentials: {
    url: "env.process.URL",
    connectionString:
      "env.process.connectionString",
  },
};
