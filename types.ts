export type Message = {
  type: 'create' | 'join' | 'swipe-right' | 'request-more';
  payload: object;
}

export type Party = {
  id: string;
  current?: Restaurant[];
  error?: string;
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
  hours?: Hours[];
  id: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  name: string;
  phone: string;
  photos?: string[];
  price: string;
  rating: number;
  review_count: number;
  transactions: string[];
  url: string;

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

export type Hours = {
  hours_type: 'REGULAR';
  is_open_now: boolean;
  open: {
    day: number;
    end: string;
    is_overnight: boolean;
    start: string;
  }[];
}
