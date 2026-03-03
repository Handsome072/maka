// Utility functions for persisting listing data to localStorage

export interface ListingData {
  isHost: boolean;
  uploadedPhotos: string[];
  listingTitle: string;
  propertyType?: string;
  spaceType?: string;
  location?: {
    address: string;
    city: string;
    country: string;
  };
  guestInfo?: {
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities?: string[];
  description?: string;
  highlights?: string[];
  pricing?: {
    basePrice: number;
    weekendPrice?: number;
    weeklyDiscount?: number;
  };
  reservationSettings?: {
    instantBooking: boolean;
    minNights: number;
    maxNights: number;
  };
}

const STORAGE_KEY = 'homiqio_listing_data';

export function saveListingData(data: Partial<ListingData>): void {
  try {
    const existingData = getListingData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving listing data:', error);
  }
}

export function getListingData(): ListingData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading listing data:', error);
  }
  
  // Return default data
  return {
    isHost: false,
    uploadedPhotos: [],
    listingTitle: 'Maison hôte calme',
  };
}

export function clearListingData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing listing data:', error);
  }
}

export function updateListingPhotos(photos: string[]): void {
  saveListingData({ uploadedPhotos: photos });
}

export function updateListingTitle(title: string): void {
  saveListingData({ listingTitle: title });
}

export function setHostStatus(isHost: boolean): void {
  saveListingData({ isHost });
}
