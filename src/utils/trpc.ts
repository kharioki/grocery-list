import { createReactQueryHooks, createTRPCReact } from "@trpc/react-query";
import type { ServerRouter } from "@/server/router";

export const trpc = createTRPCReact<ServerRouter>();