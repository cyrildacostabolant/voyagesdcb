// @ts-nocheck
import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const addBag = mutationGeneric({
  args: { tripId: v.id("trips"), name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bags", {
      tripId: args.tripId,
      name: args.name,
      page: 1,
    });
  },
});

export const updateBagPage = mutationGeneric({
  args: { id: v.id("bags"), page: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { page: args.page });
  },
});

export const updateBagName = mutationGeneric({
  args: { id: v.id("bags"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const deleteBag = mutationGeneric({
  args: { id: v.id("bags") },
  handler: async (ctx, args) => {
    // Cascade delete items
    const items = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("bagId"), args.id))
      .collect();
      
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    
    await ctx.db.delete(args.id);
  },
});
