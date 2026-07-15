// @ts-nocheck
import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const addItem = mutationGeneric({
  args: { bagId: v.id("bags"), name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", {
      bagId: args.bagId,
      name: args.name,
      isPacked: false,
    });
  },
});

export const toggleItemPacked = mutationGeneric({
  args: { id: v.id("items"), isPacked: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isPacked: !args.isPacked });
  },
});

export const deleteItem = mutationGeneric({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
