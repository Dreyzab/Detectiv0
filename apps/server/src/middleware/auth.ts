import { clerkPlugin } from "elysia-clerk";

export const authModule = clerkPlugin();

// Usage example for protected routes:
// app.use(authModule).get("/protected", ({ auth }) => { ... })
