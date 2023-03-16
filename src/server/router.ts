import { initTRPC } from '@trpc/server';
import { z } from "zod"

import { Context } from "./context"

const t = initTRPC.context<Context>().create();
 
const router = t.router;
const publicProcedure = t.procedure; 

export const serverRouter = router({
  findAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.groceryList.findMany();
    }
  ),
  insertOne: publicProcedure
    .input(z.object({
        title: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.groceryList.create({
        data: { title: input.title },
      });
    }
  ),
  updateOne: publicProcedure
    .input(z.object({
        id: z.number(),
        title: z.string(),
        checked: z.boolean(),
    }))
    .mutation(({ input, ctx }) => {
      const { id, ...rest } = input;

      return ctx.prisma.groceryList.update({
        where: { id },
        data: { ...rest },
      });
    }
  ),
  deleteAll: publicProcedure
    .input(z.object({
        ids: z.number().array(),
    }))
    .mutation(({ input, ctx }) => {
      const { ids } = input;

      return ctx.prisma.groceryList.deleteMany({
        where: { id: { in: ids } },
      });
    }
  ),
});



//   .router<Context>()
//   .query("findAll", {
//     resolve: async ({ ctx }) => {
//       return ctx.prisma.groceryList.findMany();
//     },
//   })
//   .mutation("insertOne", {
//     input: z.object({
//       title: z.string(),
//     }),
//     resolve: async ({ input, ctx }) => {
//       return ctx.prisma.groceryList.create({
//         data: { title: input.title },
//       });
//     },
//   })
//   .mutation("updateOne", {
//     input: z.object({
//       id: z.number(),
//       title: z.string(),
//       checked: z.boolean(),
//     }),
//     resolve: async ({ input, ctx }) => {
//       const { id, ...rest } = input;

//       return await ctx.prisma.groceryList.update({
//         where: { id },
//         data: { ...rest },
//       });
//     },
//   })
//   .mutation("deleteAll", {
//     input: z.object({
//       ids: z.number().array(),
//     }),
//     resolve: async ({ input, ctx }) => {
//       const { ids } = input;

//       return await ctx.prisma.groceryList.deleteMany({
//         where: { id: { in: ids } },
//       });
//     },
//   });

export type ServerRouter = typeof serverRouter;
