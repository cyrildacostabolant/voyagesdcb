export interface Item {
  id: string;
  name: string;
  isPacked: boolean;
}

export interface Bag {
  id: string;
  name: string;
  page?: number;
  items: Item[];
}

export interface Trip {
  id: string;
  name: string;
  date: string;
  isArchived: boolean;
  bags: Bag[];
}
