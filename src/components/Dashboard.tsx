import React, { useState } from 'react';
import { Trip } from '../types';
import { Briefcase, Archive, Plus, Copy, Trash2, ArchiveRestore, CheckCircle } from 'lucide-react';

interface DashboardProps {
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onAddTrip: (name: string, date: string) => void;
  onDuplicateTrip: (trip: Trip, name: string, date: string) => void;
  onToggleArchive: (id: string, isArchived: boolean) => void;
  onDeleteTrip: (id: string) => void;
}

export function Dashboard({
  trips,
  onSelectTrip,
  onAddTrip,
  onDuplicateTrip,
  onToggleArchive,
  onDeleteTrip
}: DashboardProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [newTripDate, setNewTripDate] = useState('');

  const [duplicatingTrip, setDuplicatingTrip] = useState<Trip | null>(null);

  const activeTrips = trips.filter(t => !t.isArchived);
  const archivedTrips = trips.filter(t => t.isArchived);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTripName.trim()) {
      onAddTrip(newTripName.trim(), newTripDate.trim());
      setIsCreating(false);
      setNewTripName('');
      setNewTripDate('');
    }
  };

  const handleDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicatingTrip && newTripName.trim()) {
      onDuplicateTrip(duplicatingTrip, newTripName.trim(), newTripDate.trim());
      setDuplicatingTrip(null);
      setNewTripName('');
      setNewTripDate('');
    }
  };

  const displayedTrips = showArchived ? archivedTrips : activeTrips;

  return (
    <div className="h-full flex flex-col">
      <nav className="h-20 border-b border-[#e5e1d5] flex items-center justify-between px-10 bg-white/50 backdrop-blur-sm shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#5d6d53] rounded-xl flex items-center justify-center text-white">
            <Briefcase size={24} />
          </div>
          <span className="text-2xl font-serif italic font-bold text-[#3e4a36]">Mes Voyages</span>
        </div>
      </nav>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex gap-2 bg-[#fdfcf9] border border-[#e5e1d5] p-1 rounded-lg">
              <button
                onClick={() => setShowArchived(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!showArchived ? 'bg-[#f1eee4] text-[#434138]' : 'text-[#8c887d] hover:text-[#434138]'}`}
              >
                En cours ({activeTrips.length})
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showArchived ? 'bg-[#f1eee4] text-[#434138]' : 'text-[#8c887d] hover:text-[#434138]'}`}
              >
                Archivés ({archivedTrips.length})
              </button>
            </div>
            {!showArchived && !isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center space-x-2 bg-[#5d6d53] text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-[#5d6d53]/20 font-medium transition-transform active:scale-95"
              >
                <Plus size={18} />
                <span>Nouveau voyage</span>
              </button>
            )}
          </div>

          {(isCreating || duplicatingTrip) && (
            <div className="mb-8 bg-white p-6 rounded-[32px] border border-[#e5e1d5] shadow-sm max-w-2xl mx-auto">
              <h2 className="text-xl font-serif italic text-[#3e4a36] mb-4">
                {duplicatingTrip ? `Créer à partir de "${duplicatingTrip.name}"` : 'Nouveau voyage'}
              </h2>
              <form onSubmit={duplicatingTrip ? handleDuplicate : handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#a19d91] font-bold mb-2">Nom du voyage</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Ex: Vacances d'été 2024"
                      value={newTripName}
                      onChange={e => setNewTripName(e.target.value)}
                      className="w-full bg-[#fdfcf9] border border-[#e5e1d5] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#5d6d53] text-[#434138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#a19d91] font-bold mb-2">Dates (optionnel)</label>
                    <input
                      type="text"
                      placeholder="Ex: 15 au 30 Août"
                      value={newTripDate}
                      onChange={e => setNewTripDate(e.target.value)}
                      className="w-full bg-[#fdfcf9] border border-[#e5e1d5] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#5d6d53] text-[#434138]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setDuplicatingTrip(null);
                      setNewTripName('');
                      setNewTripDate('');
                    }}
                    className="px-6 py-2.5 rounded-full border border-[#5d6d53] text-[#5d6d53] text-sm font-medium hover:bg-[#f0f4ef] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!newTripName.trim()}
                    className="px-6 py-2.5 rounded-full bg-[#5d6d53] text-white font-medium shadow-md shadow-[#5d6d53]/20 hover:bg-[#3e4a36] transition-colors disabled:opacity-50"
                  >
                    {duplicatingTrip ? 'Créer le modèle' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {displayedTrips.length === 0 && !isCreating && !duplicatingTrip ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-[#dcd7cb] max-w-2xl mx-auto">
              <div className="bg-[#f1eee4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8c887d]">
                {showArchived ? <Archive size={24} /> : <Briefcase size={24} />}
              </div>
              <h3 className="text-xl font-serif italic text-[#3e4a36] mb-2">
                {showArchived ? 'Aucun voyage archivé' : 'Aucun voyage en cours'}
              </h3>
              <p className="text-[#8c887d] max-w-sm mx-auto mb-6 text-sm">
                {showArchived 
                  ? 'Les voyages que vous archivez apparaîtront ici.' 
                  : 'Créez votre premier voyage pour commencer à organiser vos bagages.'}
              </p>
              {!showArchived && (
                 <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-2.5 rounded-full bg-[#5d6d53] text-white font-medium shadow-md shadow-[#5d6d53]/20 hover:bg-[#3e4a36] transition-colors"
                  >
                    Créer mon premier voyage
                  </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTrips.map(trip => {
                const totalItems = trip.bags.reduce((acc, bag) => acc + bag.items.length, 0);
                const packedItems = trip.bags.reduce((acc, bag) => acc + bag.items.filter(i => i.isPacked).length, 0);
                
                return (
                  <div key={trip.id} className="bg-white rounded-3xl border border-[#e5e1d5] shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
                    <div 
                      className="p-6 cursor-pointer flex-grow"
                      onClick={() => onSelectTrip(trip.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#f1eee4] p-4 rounded-2xl border border-[#e5e1d5] w-full">
                          <h2 className="font-serif italic text-lg leading-tight mb-1 text-[#434138]">{trip.name}</h2>
                          {trip.date && <p className="text-xs text-[#8c887d]">{trip.date}</p>}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 text-xs text-[#8c887d] px-2">
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={14} />
                          <span>{trip.bags.length} bagages</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={14} />
                          <span>{packedItems}/{totalItems} articles prêts</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#fdfcf9] border-t border-[#f1eee4] px-4 py-3 flex justify-end gap-2 relative z-10">
                       <button
                        onClick={(e) => { e.stopPropagation(); setDuplicatingTrip(trip); }}
                        className="p-2 text-[#8c887d] hover:text-[#5d6d53] hover:bg-[#f1eee4] rounded-xl transition-colors flex items-center gap-2"
                        title="Utiliser comme modèle"
                      >
                        <Copy size={16} />
                        <span className="text-xs font-medium">Modèle</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleArchive(trip.id, trip.isArchived); }}
                        className="p-2 text-[#8c887d] hover:text-[#5d6d53] hover:bg-[#f1eee4] rounded-xl transition-colors flex items-center gap-2"
                        title={trip.isArchived ? "Désarchiver" : "Archiver"}
                      >
                        {trip.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                        <span className="text-xs font-medium">{trip.isArchived ? "Restaurer" : "Archiver"}</span>
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(window.confirm('Voulez-vous vraiment supprimer ce voyage ?')) onDeleteTrip(trip.id); 
                        }}
                        className="p-2 text-[#8c887d] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
