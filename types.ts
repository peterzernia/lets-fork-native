export type Message = {
  type: 'create' | 'join' | 'swipe-right' | 'request-more';
  payload: object;
}

export type Party = {
  id: string;
  current?: Restaurant[];
  matches?: Restaurant[];
  restaurants?: Restaurant[];
  status: 'waiting' | 'active';
  total?: number;
}

export type Restaurant = {
  alias: string;
  display_phone: string;
  id: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  name: string;
  phone: string;
  photos: string[];
  price: string;
  rating: number;
  transactions: string[];
  url: string;
}
