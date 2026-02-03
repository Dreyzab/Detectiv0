import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { logger } from "@repo/shared";
import { db } from "./db";
import { healthModule } from "./modules/health";
import { mapModule } from "./modules/map";
import { adminModule } from "./modules/admin";
import { detectiveModule } from "./modules/detective";


const app = new Elysia()
  .use(cors({
    origin: true, // Allow all origins in dev
    credentials: true,
  }))
  .use(swagger())
  .use(healthModule)
  .use(mapModule)
  .use(adminModule)
  .use(detectiveModule)
  .get("/", () => "Hello Elysia");

if (import.meta.main) {
  app.listen({
    port: process.env.PORT || 3000,
    hostname: '0.0.0.0'
  });
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
  logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

export { app };
export type App = typeof app;
