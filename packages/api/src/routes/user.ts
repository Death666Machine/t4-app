import { eq } from 'drizzle-orm'
import { User, UserSchema } from '../db/schema'
import { router, protectedProcedure } from '../trpc'
import { parseAsync } from 'valibot'

export const userRouter = router({
  current: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx
    const user = await db.select().from(User).where(eq(User.id, ctx.user.id)).get()
    if (user) {
      return user
    }
    return null
  }),
  create: protectedProcedure
    .input((raw) => parseAsync(UserSchema, raw))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx
      try {
        const newUser = {
          email: input.email,
          id: input.id,
        }
        const user = await db.insert(User).values(newUser).run()
        return user
      } catch (err) {
        console.log(err)
        return null
      }
    }),
})
