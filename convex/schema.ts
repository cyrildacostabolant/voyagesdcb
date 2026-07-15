import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trips: defineTable({
    name: v.string(),
    date: v.optional(v.string()),
    isArchived: v.boolean(),
  }),
  bags: defineTable({
    tripId: v.id("trips"),
    name: v.string(),
    page: v.optional(v.number()),
  }),
  items: defineTable({
    bagId: v.id("bags"),
    name: v.string(),
    isPacked: v.boolean(),
  }),
});
