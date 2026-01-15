import { z } from 'zod';
import { baseProcedure, router } from '../trpc';

export const todoRouter = router({
    all: baseProcedure.query(({ ctx }) => {
        return ctx.user.findMany({
            orderBy: {
                // createdAt: 'asc',
            },
        });
    }),
    add: baseProcedure
        .input(
            z.object({
                name: z.string().max(100),
                password: z.string().min(6),
                email: z.string().email(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const todo = await ctx.user.create({
                data: input,
            });
            return todo;
        }),
    edit: baseProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                data: z.object({
                    completed: z.boolean().optional(),
                    text: z.string().min(1).optional(),
                }),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, data } = input;
            const todo = await ctx.user.update({
                where: { id: parseInt(id, 10) },
                data,
            });
            return todo;
        }),
    delete: baseProcedure
        .input(z.string().uuid())
        .mutation(async ({ ctx, input: id }) => {
            await ctx.user.delete({ where: { id: parseInt(id, 10) } });
            return id;
        }),
});
