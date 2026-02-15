import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface EditRequest {
    status: RequestStatus;
    owner: Principal;
    listingId: bigint;
    createdAt: Time;
    rejectionReason?: string;
    reviewedAt?: Time;
    editedListing: Listing;
}
export type Time = bigint;
export type ListingStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "approved";
    approved: null;
} | {
    __kind__: "rejected";
    rejected: string;
};
export interface Listing {
    id: bigint;
    status: ListingStatus;
    title: string;
    propertyType: PropertyType;
    owner: Principal;
    createdAt: Time;
    description: string;
    rentalDurations: Array<RentalDuration>;
    priceRupiah: bigint;
    updatedAt: Time;
    facilities: Array<Facility>;
    location: string;
    photos: Array<ExternalBlob>;
}
export type RequestStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "approved";
    approved: null;
} | {
    __kind__: "rejected";
    rejected: string;
};
export interface ListingInput {
    title: string;
    propertyType: PropertyType;
    description: string;
    rentalDurations: Array<RentalDuration>;
    priceRupiah: bigint;
    facilities: Array<Facility>;
    location: string;
    photos: Array<ExternalBlob>;
}
export interface DeleteRequest {
    status: RequestStatus;
    owner: Principal;
    listingId: bigint;
    createdAt: Time;
    rejectionReason?: string;
    reviewedAt?: Time;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum Facility {
    wifi = "wifi",
    sharedBathroom = "sharedBathroom",
    furniture = "furniture",
    parking = "parking",
    airConditioning = "airConditioning",
    laundry = "laundry"
}
export enum PropertyType {
    kos = "kos",
    kontrakan = "kontrakan"
}
export enum RentalDuration {
    monthly = "monthly",
    yearly = "yearly",
    daily = "daily"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveListing(listingId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    countListingsByPropertyType(): Promise<[bigint, bigint]>;
    createListing(input: ListingInput): Promise<bigint>;
    filterListingsByLocation(location: string): Promise<Array<Listing>>;
    filterListingsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Listing>>;
    getAllDeleteRequests(): Promise<Array<DeleteRequest>>;
    getAllEditRequests(): Promise<Array<EditRequest>>;
    getAllListings(): Promise<Array<Listing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getListing(id: bigint): Promise<Listing>;
    getListingFacilities(listingId: bigint): Promise<Array<Facility>>;
    getListingLocations(): Promise<Array<string>>;
    getListingPhotos(listingId: bigint): Promise<Array<ExternalBlob>>;
    getListingStatus(listingId: bigint): Promise<ListingStatus>;
    getListingsByOwner(owner: Principal): Promise<Array<Listing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    processDeleteRequest(listingId: bigint, approved: boolean, rejectionReason: string | null): Promise<void>;
    processEditRequest(listingId: bigint, approved: boolean, rejectionReason: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchListingsByTitle(searchTerm: string): Promise<Array<Listing>>;
    submitDeleteRequest(listingId: bigint): Promise<void>;
    submitEditRequest(listingId: bigint, editedListing: Listing): Promise<void>;
    uploadPhoto(listingId: bigint, photo: ExternalBlob): Promise<void>;
}
