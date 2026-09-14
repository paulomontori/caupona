export type Restaurant = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  cuisine_style: string;
  reason: string;
  added_by_email: string;
  created_at: string;
};

export type RestaurantReview = {
  id: string;
  restaurant_id: string;
  user_email: string;
  went: boolean;
  rating: number | null;
  impression: string | null;
  updated_at: string;
};

export type RestaurantWithReviews = Restaurant & {
  reviews: RestaurantReview[];
};
