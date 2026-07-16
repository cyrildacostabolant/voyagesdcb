// @ts-nocheck
import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const addItem = mutationGeneric({
  args: { bagId: v.id("bags"), name: v.string(), quantity: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", {
      bagId: args.bagId,
      name: args.name,
      isPacked: false,
      quantity: args.quantity,
    });
  },
});

export const toggleItemPacked = mutationGeneric({
  args: { id: v.id("items"), isPacked: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isPacked: !args.isPacked });
  },
});

export const updateItem = mutationGeneric({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    quantity: v.optional(v.number()),
    isPacked: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const patch: any = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.quantity !== undefined) patch.quantity = args.quantity;
    if (args.isPacked !== undefined) patch.isPacked = args.isPacked;
    await ctx.db.patch(args.id, patch);
  },
});

export const deleteItem = mutationGeneric({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
