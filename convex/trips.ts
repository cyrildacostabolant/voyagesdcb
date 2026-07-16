// @ts-nocheck
import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

export const getTrips = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const trips = await ctx.db.query("trips").collect();
    
    // Fetch bags and items for each trip
    const fullTrips = await Promise.all(
      trips.map(async (trip) => {
        const bags = await ctx.db
          .query("bags")
          .filter((q) => q.eq(q.field("tripId"), trip._id))
          .collect();
          
        const fullBags = await Promise.all(
          bags.map(async (bag) => {
            const items = await ctx.db
              .query("items")
              .filter((q) => q.eq(q.field("bagId"), bag._id))
              .collect();
            const mappedItems = items.map((item) => ({ ...item, id: item._id }));
            return { ...bag, items: mappedItems, id: bag._id };
          })
        );
        
        return { ...trip, bags: fullBags, id: trip._id };
      })
    );
    
    return fullTrips;
  },
});

export const addTrip = mutationGeneric({
  args: { name: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trips", {
      name: args.name,
      date: args.date,
      isArchived: false,
    });
  },
});

export const duplicateTrip = mutationGeneric({
  args: { 
    tripId: v.id("trips"),
    newName: v.string(),
    newDate: v.string() 
  },
  handler: async (ctx, args) => {
    const tripId = await ctx.db.insert("trips", {
      name: args.newName,
      date: args.newDate,
      isArchived: false,
    });

    const bags = await ctx.db
      .query("bags")
      .filter((q) => q.eq(q.field("tripId"), args.tripId))
      .collect();

    for (const bag of bags) {
      const newBagId = await ctx.db.insert("bags", {
        tripId,
        name: bag.name,
        page: bag.page ?? 1,
      });

      const items = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("bagId"), bag._id))
        .collect();

      for (const item of items) {
        await ctx.db.insert("items", {
          bagId: newBagId,
          name: item.name,
          isPacked: false, // Reset packed status
        });
      }
    }
    return tripId;
  },
});

export const toggleArchiveTrip = mutationGeneric({
  args: { id: v.id("trips"), isArchived: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isArchived: !args.isArchived });
  },
});

export const deleteTrip = mutationGeneric({
  args: { id: v.id("trips") },
  handler: async (ctx, args) => {
    // Cascade delete bags and items
    const bags = await ctx.db
      .query("bags")
      .filter((q) => q.eq(q.field("tripId"), args.id))
      .collect();
      
    for (const bag of bags) {
      const items = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("bagId"), bag._id))
        .collect();
        
      for (const item of items) {
        await ctx.db.delete(item._id);
      }
      await ctx.db.delete(bag._id);
    }
    
    await ctx.db.delete(args.id);
  },
});
