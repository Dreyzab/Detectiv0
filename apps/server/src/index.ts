import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { logger } from "@repo/shared";
import { healthModule } from "./modules/health";
import { mapModule } from "./modules/map";
import { adminModule } from "./modules/admin";
import { detectiveModule } from "./modules/detective";
import { engineModule } from "./modules/engine";
import { inventoryModule } from "./modules/inventory";
import { questsModule } from "./modules/quests";
import { dossierModule } from "./modules/dossier";
import { authModule } from "./middleware/auth";


const app = new Elysia()
  .use(cors({
    origin: (request) => {
      const origin = request.headers.get('origin');
      if (!origin) return true; // Allow non-browser requests
      const allowedOrigins = [
        'https://detective-prod-8f6f0.web.app',
        'http://localhost:5173',
        'http://localhost:4173'
      ];
      // Allow if exact match or strict subdirectory if needed (usually exact match is safer)
      return allowedOrigins.includes(origin);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }))
  .use(swagger())
  .use(authModule)
  .use(healthModule)
  .use(mapModule)
  .use(inventoryModule)
  .use(questsModule)
  .use(dossierModule)
  .use(adminModule)
  .use(detectiveModule)
  .use(engineModule)
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
