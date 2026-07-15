/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTravelStore } from './store';
import { Dashboard } from './components/Dashboard';
import { TripDetail } from './components/TripDetail';

export default function App() {
  const store = useTravelStore();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const selectedTrip = selectedTripId 
    ? store.trips.find(t => t.id === selectedTripId) 
    : null;

  if (selectedTrip) {
    return (
      <div className="h-screen overflow-hidden print:h-auto print:overflow-visible bg-[#f7f5f0] font-sans text-[#434138]">
        <TripDetail
          trip={selectedTrip}
          onBack={() => setSelectedTripId(null)}
          onAddBag={store.addBag}
          onDeleteBag={store.deleteBag}
          onUpdateBagPage={store.updateBagPage}
          onAddItem={store.addItem}
          onToggleItem={store.toggleItemPacked}
          onDeleteItem={store.deleteItem}
        />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f7f5f0] font-sans text-[#434138]">
      <Dashboard
        trips={store.trips}
        onSelectTrip={setSelectedTripId}
        onAddTrip={async (name, date) => {
          const id = await store.addTrip(name, date);
          setSelectedTripId(id);
        }}
        onDuplicateTrip={async (trip, name, date) => {
          const id = await store.duplicateTrip(trip.id, name, date);
          setSelectedTripId(id);
        }}
        onToggleArchive={store.toggleArchiveTrip}
        onDeleteTrip={store.deleteTrip}
      />
    </div>
  );
}
