import React, { useState } from 'react';
import { Bag } from '../types';
import { Check, Plus, Trash2, X } from 'lucide-react';

interface BagViewProps {
  tripId: string;
  bag: Bag;
  onAddItem: (tripId: string, bagId: string, name: string) => void;
  onToggleItem: (tripId: string, bagId: string, itemId: string, isPacked: boolean) => void;
  onDeleteItem: (tripId: string, bagId: string, itemId: string) => void;
  onDeleteBag: (tripId: string, bagId: string) => void;
  onUpdateBagPage: (bagId: string, page: number) => void;
}

export function BagView({ tripId, bag, onAddItem, onToggleItem, onDeleteItem, onDeleteBag, onUpdateBagPage }: BagViewProps) {
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(tripId, bag.id, newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#e5e1d5] overflow-hidden flex flex-col">
      <div className="bg-[#fdfcf9] px-5 py-4 border-b border-[#e5e1d5] flex justify-between items-center group">
        <h3 className="font-serif italic font-bold text-[#3e4a36] text-xl truncate pr-2">{bag.name}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#8c887d] uppercase font-bold tracking-wider">Page</span>
            <select
              value={bag.page || 1}
              onChange={(e) => onUpdateBagPage(bag.id, parseInt(e.target.value))}
              className="bg-[#f1eee4] border-none rounded-md text-xs px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#5d6d53] font-medium text-[#434138] cursor-pointer"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if(window.confirm('Supprimer ce bagage ?')) onDeleteBag(tripId, bag.id);
            }}
            className="text-[#8c887d] hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            title="Supprimer le bagage"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="p-5 flex-1 bg-white">
        <ul className="space-y-2">
          {bag.items.map(item => (
            <li key={item.id} className="flex items-center group/item p-3 bg-[#fdfcf9] border border-[#e5e1d5] rounded-xl transition-colors">
              <button
                onClick={() => onToggleItem(tripId, bag.id, item.id, item.isPacked)}
                className="flex-shrink-0 mr-3 flex items-center justify-center w-5 h-5 rounded-md border text-white transition-colors"
                style={{ 
                  backgroundColor: item.isPacked ? '#5d6d53' : 'transparent', 
                  borderColor: item.isPacked ? '#5d6d53' : '#c9c5b8' 
                }}
              >
                {item.isPacked && <Check size={14} strokeWidth={3} />}
              </button>
              <span className={`flex-1 text-sm ${item.isPacked ? 'text-[#8c887d]' : 'text-[#434138]'}`}>
                {item.name}
              </span>
              <button
                onClick={() => onDeleteItem(tripId, bag.id, item.id)}
                className="text-[#dcd7cb] hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
        {bag.items.length === 0 && (
          <p className="text-[#a19d91] text-sm text-center py-6 italic">Ce bagage est vide.</p>
        )}
      </div>
      <div className="p-4 border-t border-[#f1eee4] bg-[#fdfcf9]">
        <form onSubmit={handleAdd} className="flex relative">
          <input
            type="text"
            placeholder="Ajouter un article..."
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="w-full bg-white border border-[#e5e1d5] rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#5d6d53] text-[#434138]"
          />
          <button
            type="submit"
            disabled={!newItemName.trim()}
            className="absolute right-2 top-2 bottom-2 px-2 text-[#8c887d] hover:text-[#5d6d53] disabled:opacity-50 transition-colors"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
