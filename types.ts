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
  categories: Categories[];
  coordinates: Coordinates;
  location: Location;
  display_phone: string;
  id: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  name: string;
  phone: string;
  photos?: string[];
  price: string;
  rating: number;
  transactions: string[];
  url: string;

  // review_count?
  // hours?
  // special_hours?
}

type Categories = {
  alias: string;
  title: string;
}

type Coordinates = {
  latitude: number;
  longitude: number;
}

type Location = {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  country: string;
  state: string;
  zip_code: string;
}
