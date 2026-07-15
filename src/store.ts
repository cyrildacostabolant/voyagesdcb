import { useQuery, useMutation } from "convex/react";
// @ts-ignore
import { api } from "../convex/_generated/api";

export function useTravelStore() {
  const trips = useQuery(api.trips.getTrips) || [];
  
  const addTrip = useMutation(api.trips.addTrip);
  const duplicateTrip = useMutation(api.trips.duplicateTrip);
  const deleteTrip = useMutation(api.trips.deleteTrip);
  const toggleArchiveTrip = useMutation(api.trips.toggleArchiveTrip);
  
  const addBag = useMutation(api.bags.addBag);
  const deleteBag = useMutation(api.bags.deleteBag);
  
  const addItem = useMutation(api.items.addItem);
  const toggleItemPacked = useMutation(api.items.toggleItemPacked);
  const deleteItem = useMutation(api.items.deleteItem);

  return {
    trips,
    addTrip: (name: string, date: string) => addTrip({ name, date }),
    duplicateTrip: (tripId: string, newName: string, newDate: string) => duplicateTrip({ tripId, newName, newDate }),
    deleteTrip: (id: string) => deleteTrip({ id }),
    toggleArchiveTrip: (id: string, isArchived: boolean) => toggleArchiveTrip({ id, isArchived }),
    addBag: (tripId: string, name: string) => addBag({ tripId, name }),
    deleteBag: (tripId: string, id: string) => deleteBag({ id }),
    addItem: (tripId: string, bagId: string, name: string) => addItem({ bagId, name }),
    toggleItemPacked: (tripId: string, bagId: string, id: string, isPacked: boolean) => toggleItemPacked({ id, isPacked }),
    deleteItem: (tripId: string, bagId: string, id: string) => deleteItem({ id })
  };
}
