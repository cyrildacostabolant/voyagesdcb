// @ts-nocheck
import React, { useState } from 'react';
import { Trip } from '../types';
import { BagView } from './BagView';
import { ArrowLeft, Plus, Briefcase, Printer } from 'lucide-react';

interface TripDetailProps {
  trip: Trip;
  onBack: () => void;
  onAddBag: (tripId: string, name: string) => void;
  onDeleteBag: (tripId: string, bagId: string) => void;
  onUpdateBagPage: (bagId: string, page: number) => void;
  onAddItem: (tripId: string, bagId: string, name: string) => void;
  onToggleItem: (tripId: string, bagId: string, itemId: string, isPacked: boolean) => void;
  onDeleteItem: (tripId: string, bagId: string, itemId: string) => void;
}

export function TripDetail({
  trip,
  onBack,
  onAddBag,
  onDeleteBag,
  onUpdateBagPage,
  onAddItem,
  onToggleItem,
  onDeleteItem
}: TripDetailProps) {
  const [newBagName, setNewBagName] = useState('');
  const [isAddingBag, setIsAddingBag] = useState(false);

  const handleAddBag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBagName.trim()) {
      onAddBag(trip.id, newBagName.trim());
      setNewBagName('');
      setIsAddingBag(false);
    }
  };

  const uniquePages = Array.from(new Set(trip.bags.map(b => b.page || 1))).sort((a, b) => a - b);

  const totalItems = trip.bags.reduce((acc, bag) => acc + bag.items.length, 0);
  const packedItems = trip.bags.reduce((acc, bag) => acc + bag.items.filter(i => i.isPacked).length, 0);
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <>
      {/* Normal UI */}
      <div className="h-full flex flex-col print:hidden">
        <header className="bg-white/50 backdrop-blur-sm border-b border-[#e5e1d5] px-6 py-4 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#f1eee4] rounded-full transition-colors text-[#8c887d]"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-serif italic font-bold text-[#3e4a36]">{trip.name}</h1>
              {trip.date && <p className="text-xs text-[#8c887d]">{trip.date}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.print()}
              className="p-2 text-[#5d6d53] bg-[#f1eee4] hover:bg-[#e5e1d5] rounded-full transition-colors flex items-center gap-2 px-4"
              title="Générer PDF / Imprimer"
            >
              <Printer size={18} />
              <span className="text-sm font-medium hidden sm:inline">PDF / Imprimer</span>
            </button>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-[#5d6d53]">{progress}% Prêt</div>
              <div className="w-32 h-2 bg-[#e5e1d5] rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#5d6d53] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-lg font-serif italic text-[#3e4a36]">Mes Bagages</h2>
              {!isAddingBag && (
                <button
                  onClick={() => setIsAddingBag(true)}
                  className="flex items-center gap-2 bg-[#5d6d53] text-white px-5 py-2.5 rounded-full hover:bg-[#3e4a36] transition-colors shadow-md shadow-[#5d6d53]/20 text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Nouveau bagage</span>
                </button>
              )}
            </div>

            {isAddingBag && (
              <form onSubmit={handleAddBag} className="mb-8 bg-white p-6 rounded-3xl border border-[#e5e1d5] shadow-sm flex gap-3 max-w-lg mx-auto">
                <input
                  type="text"
                  autoFocus
                  placeholder="Nom du bagage (ex: Valise Samsonite)"
                  value={newBagName}
                  onChange={e => setNewBagName(e.target.value)}
                  className="flex-1 bg-[#fdfcf9] border border-[#e5e1d5] rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#5d6d53] text-[#434138]"
                />
                <button
                  type="submit"
                  disabled={!newBagName.trim()}
                  className="bg-[#5d6d53] text-white px-5 py-2 rounded-xl hover:bg-[#3e4a36] transition-colors disabled:opacity-50 font-medium text-sm"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBag(false);
                    setNewBagName('');
                  }}
                  className="text-[#8c887d] hover:bg-[#f1eee4] px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  Annuler
                </button>
              </form>
            )}

            {trip.bags.length === 0 && !isAddingBag ? (
              <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-[#dcd7cb] max-w-2xl mx-auto">
                <div className="bg-[#f1eee4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8c887d]">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-serif italic text-[#3e4a36] mb-2">Aucun bagage</h3>
                <p className="text-[#8c887d] mb-6 max-w-sm mx-auto text-sm">Commencez par ajouter une valise, un sac à dos ou une trousse de toilette pour ce voyage.</p>
                <button
                  onClick={() => setIsAddingBag(true)}
                  className="text-[#5d6d53] font-bold hover:text-[#3e4a36] text-sm flex items-center justify-center mx-auto"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter mon premier bagage
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {trip.bags.map(bag => (
                  <BagView
                    key={bag.id}
                    tripId={trip.id}
                    bag={bag}
                    onAddItem={onAddItem}
                    onToggleItem={onToggleItem}
                    onDeleteItem={onDeleteItem}
                    onDeleteBag={onDeleteBag}
                    onUpdateBagPage={onUpdateBagPage}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Print Layout */}
      <div className="hidden print:block w-full bg-white text-black">
        <style>{`
          @media print {
            @page { margin: 0; size: A4 portrait; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
            .print-page {
              width: 210mm;
              min-height: 296mm;
              padding: 10mm;
              box-sizing: border-box;
              page-break-after: always;
              background: white;
            }
            .print-page:last-child {
              page-break-after: auto;
            }
          }
        `}</style>
        
        {uniquePages.length > 0 ? uniquePages.map(pageNum => {
          const bagsOnPage = trip.bags.filter(b => (b.page || 1) === pageNum);
          if (bagsOnPage.length === 0) return null;
          
          return (
            <div key={pageNum} className="print-page">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-serif italic text-black">{trip.name}</h1>
                <div className="flex justify-center items-center gap-4 mt-2">
                  {trip.date && <p className="text-sm text-gray-600">{trip.date}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-10 items-start">
                {bagsOnPage.map(bag => (
                  <div key={bag.id} className="break-inside-avoid">
                    <div className="font-bold text-[#b30000] text-center mb-2 text-lg">
                      {bag.name}
                    </div>
                    <div className="border border-[#a2b9ce]">
                      {bag.items.map((item, index) => (
                        <div 
                          key={item.id} 
                          className={`px-3 py-1.5 text-[13px] min-h-[30px] flex items-center justify-between ${index !== bag.items.length - 1 ? 'border-b border-[#a2b9ce]' : ''}`}
                        >
                          <span className="text-gray-900 leading-tight">{item.name}</span>
                          <div className="w-3.5 h-3.5 border border-gray-400 rounded-[3px] shrink-0 ml-2"></div>
                        </div>
                      ))}
                      {bag.items.length === 0 && (
                        <div className="px-3 py-4 text-sm text-center text-gray-400 italic">
                          Aucun élément
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }) : (
           <div className="print-page text-center pt-20 text-gray-500">Aucun bagage</div>
        )}
      </div>
    </>
  );
}

