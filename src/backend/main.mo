import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Facility = {
    #parking;
    #airConditioning;
    #wifi;
    #furniture;
    #laundry;
    #sharedBathroom;
  };

  type RentalDuration = {
    #daily;
    #monthly;
    #yearly;
  };

  type PropertyType = {
    #kos;
    #kontrakan;
  };

  public type Listing = {
    id : Nat;
    owner : Principal;
    title : Text;
    priceRupiah : Nat;
    location : Text;
    propertyType : PropertyType;
    facilities : [Facility];
    rentalDurations : [RentalDuration];
    description : Text;
    photos : [Storage.ExternalBlob];
    status : ListingStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type ListingInternal = {
    id : Nat;
    owner : Principal;
    title : Text;
    priceRupiah : Nat;
    location : Text;
    propertyType : PropertyType;
    facilities : [Facility];
    rentalDurations : [RentalDuration];
    description : Text;
    photos : [Storage.ExternalBlob];
    status : ListingStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type ListingStatus = {
    #pending;
    #approved;
    #rejected : Text;
  };

  public type EditRequest = {
    listingId : Nat;
    owner : Principal;
    editedListing : Listing;
    status : RequestStatus;
    createdAt : Time.Time;
    reviewedAt : ?Time.Time;
    rejectionReason : ?Text;
  };

  public type DeleteRequest = {
    listingId : Nat;
    owner : Principal;
    status : RequestStatus;
    createdAt : Time.Time;
    reviewedAt : ?Time.Time;
    rejectionReason : ?Text;
  };

  public type RequestStatus = {
    #pending;
    #approved;
    #rejected : Text;
  };

  public type ListingInput = {
    title : Text;
    priceRupiah : Nat;
    location : Text;
    propertyType : PropertyType;
    facilities : [Facility];
    rentalDurations : [RentalDuration];
    description : Text;
    photos : [Storage.ExternalBlob];
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  let listings = Map.empty<Nat, ListingInternal>();
  let editRequests = Map.empty<Nat, EditRequest>();
  let deleteRequests = Map.empty<Nat, DeleteRequest>();
  let listingsCounter = Map.empty<Text, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getNextListingId() : Nat {
    let current = switch (listingsCounter.get("counter")) {
      case (null) { 0 };
      case (?value) { value };
    };
    listingsCounter.add("counter", current + 1);
    current + 1;
  };

  module Listing {
    public func compareByCreatedAt(listing1 : Listing, listing2 : Listing) : Order.Order {
      Int.compare(listing1.createdAt, listing2.createdAt);
    };

    public func compareByPrice(listing1 : Listing, listing2 : Listing) : Order.Order {
      Nat.compare(listing1.priceRupiah, listing2.priceRupiah);
    };
  };

  func canViewListing(caller : Principal, listing : ListingInternal) : Bool {
    switch (listing.status) {
      case (#approved) { true };
      case (#pending) {
        listing.owner == caller or AccessControl.isAdmin(accessControlState, caller)
      };
      case (#rejected(_)) {
        listing.owner == caller or AccessControl.isAdmin(accessControlState, caller)
      };
    };
  };

  func toPublicListing(listing : ListingInternal) : Listing {
    {
      listing with
      status = listing.status;
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createListing(input : ListingInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only property owners can create listings");
    };

    let id = getNextListingId();
    let currentTime = Time.now();

    let status = if (AccessControl.isAdmin(accessControlState, caller)) {
      #approved;
    } else {
      #pending;
    };

    let newListing : ListingInternal = {
      id;
      owner = caller;
      title = input.title;
      priceRupiah = input.priceRupiah;
      location = input.location;
      propertyType = input.propertyType;
      facilities = input.facilities;
      rentalDurations = input.rentalDurations;
      description = input.description;
      photos = input.photos;
      status;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    listings.add(id, newListing);
    id;
  };

  public query ({ caller }) func getListing(id : Nat) : async Listing {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (not canViewListing(caller, listing)) {
          Runtime.trap("Unauthorized: Cannot view this listing");
        };
        toPublicListing(listing);
      };
    };
  };

  public query ({ caller }) func getAllListings() : async [Listing] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = listings.values().toArray().filter(
      func(listing) {
        canViewListing(caller, listing);
      }
    );
    filtered.map<ListingInternal, Listing>(toPublicListing);
  };

  public query ({ caller }) func getListingsByOwner(owner : Principal) : async [Listing] {
    if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own listings");
    };

    let filtered = listings.values().toArray().filter(
      func(listing) {
        listing.owner == owner;
      }
    );
    filtered.map<ListingInternal, Listing>(toPublicListing);
  };

  public query ({ caller }) func filterListingsByPriceRange(minPrice : Nat, maxPrice : Nat) : async [Listing] {
    let filtered = listings.values().toArray().filter(
      func(listing) {
        listing.priceRupiah >= minPrice and listing.priceRupiah <= maxPrice and canViewListing(caller, listing);
      }
    );
    filtered.map<ListingInternal, Listing>(toPublicListing);
  };

  public query ({ caller }) func filterListingsByLocation(location : Text) : async [Listing] {
    let filtered = listings.values().toArray().filter(
      func(listing) {
        listing.location.contains(#text location) and canViewListing(caller, listing);
      }
    );
    filtered.map<ListingInternal, Listing>(toPublicListing);
  };

  public shared ({ caller }) func submitEditRequest(listingId : Nat, editedListing : Listing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only property owners can submit edit requests");
    };

    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existingListing) {
        if (existingListing.owner != caller) {
          Runtime.trap("Unauthorized: You do not own this listing");
        };

        let currentTime = Time.now();

        let editRequest : EditRequest = {
          listingId;
          owner = caller;
          editedListing;
          status = #pending;
          createdAt = currentTime;
          reviewedAt = null;
          rejectionReason = null;
        };

        editRequests.add(listingId, editRequest);
      };
    };
  };

  public shared ({ caller }) func submitDeleteRequest(listingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only property owners can submit delete requests");
    };

    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existingListing) {
        if (existingListing.owner != caller) {
          Runtime.trap("Unauthorized: You do not own this listing");
        };

        let currentTime = Time.now();

        let deleteRequest : DeleteRequest = {
          listingId;
          owner = caller;
          status = #pending;
          createdAt = currentTime;
          reviewedAt = null;
          rejectionReason = null;
        };

        deleteRequests.add(listingId, deleteRequest);
      };
    };
  };

  public shared ({ caller }) func processEditRequest(listingId : Nat, approved : Bool, rejectionReason : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process edit requests");
    };

    switch (editRequests.get(listingId)) {
      case (null) { Runtime.trap("Edit request not found") };
      case (?request) {
        if (approved) {
          switch (listings.get(listingId)) {
            case (null) { Runtime.trap("Original listing not found") };
            case (?existing) {
              let updatedListing : ListingInternal = {
                existing with
                title = request.editedListing.title;
                priceRupiah = request.editedListing.priceRupiah;
                location = request.editedListing.location;
                propertyType = request.editedListing.propertyType;
                facilities = request.editedListing.facilities;
                rentalDurations = request.editedListing.rentalDurations;
                description = request.editedListing.description;
                photos = request.editedListing.photos;
                status = #approved;
                updatedAt = Time.now();
              };
              listings.add(listingId, updatedListing);
            };
          };

          let updatedRequest = {
            request with
            status = #approved;
            reviewedAt = ?Time.now();
          };
          editRequests.add(listingId, updatedRequest);
        } else {
          let reason = switch (rejectionReason) {
            case (null) { "No Reason Provided" };
            case (?r) { r };
          };
          let updatedRequest = {
            request with
            status = #rejected(reason);
            reviewedAt = ?Time.now();
            rejectionReason = ?reason;
          };
          editRequests.add(listingId, updatedRequest);
        };
      };
    };
  };

  public shared ({ caller }) func processDeleteRequest(listingId : Nat, approved : Bool, rejectionReason : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process delete requests");
    };

    switch (deleteRequests.get(listingId)) {
      case (null) { Runtime.trap("Delete request not found") };
      case (?request) {
        if (approved) {
          listings.remove(listingId);

          let updatedRequest = {
            request with
            status = #approved;
            reviewedAt = ?Time.now();
          };
          deleteRequests.add(listingId, updatedRequest);
        } else {
          let reason = switch (rejectionReason) {
            case (null) { "No Reason Provided" };
            case (?r) { r };
          };
          let updatedRequest = {
            request with
            status = #rejected(reason);
            reviewedAt = ?Time.now();
            rejectionReason = ?reason;
          };
          deleteRequests.add(listingId, updatedRequest);
        };
      };
    };
  };

  public query ({ caller }) func getAllEditRequests() : async [EditRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all edit requests");
    };

    let resultList = List.empty<EditRequest>();
    let iter = editRequests.entries();
    iter.forEach(
      func((_, request)) {
        resultList.add(request);
      }
    );
    resultList.reverse().toArray();
  };

  public query ({ caller }) func getAllDeleteRequests() : async [DeleteRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all delete requests");
    };

    let resultList = List.empty<DeleteRequest>();
    let iter = deleteRequests.entries();
    iter.forEach(
      func((_, request)) {
        resultList.add(request);
      }
    );
    resultList.reverse().toArray();
  };

  public query ({ caller }) func getListingPhotos(listingId : Nat) : async [Storage.ExternalBlob] {
    switch (listings.get(listingId)) {
      case (null) { [] };
      case (?listing) {
        if (not canViewListing(caller, listing)) {
          Runtime.trap("Unauthorized: Cannot view this listing");
        };
        listing.photos;
      };
    };
  };

  public query ({ caller }) func getListingStatus(listingId : Nat) : async ListingStatus {
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view status of your own listings");
        };
        listing.status;
      };
    };
  };

  public shared ({ caller }) func uploadPhoto(listingId : Nat, photo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only property owners can upload photos");
    };

    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this listing");
        };
        if (listing.photos.size() >= 10) {
          Runtime.trap("Photo limit reached (10)");
        };
        let updatedPhotos = listing.photos.concat([photo]);
        let updatedListing = {
          listing with
          photos = updatedPhotos;
          updatedAt = Time.now();
        };
        listings.add(listingId, updatedListing);
      };
    };
  };

  public shared ({ caller }) func approveListing(listingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve listings");
    };
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing = {
          listing with
          status = #approved;
          updatedAt = Time.now();
        };
        listings.add(listingId, updatedListing);
      };
    };
  };

  public query ({ caller }) func searchListingsByTitle(searchTerm : Text) : async [Listing] {
    let filtered = listings.values().toArray().filter(
      func(listing) {
        listing.title.contains(#text searchTerm) and canViewListing(caller, listing);
      }
    );
    filtered.map<ListingInternal, Listing>(toPublicListing);
  };

  public query ({ caller }) func getListingLocations() : async [Text] {
    let locationsList = List.empty<Text>();
    let iter = listings.entries();
    iter.forEach(
      func((_, listing)) {
        if (canViewListing(caller, listing)) {
          var exists = false;
          let locationsArray = locationsList.toArray();
          for (loc in locationsArray.vals()) {
            if (loc == listing.location) { exists := true };
          };
          if (not exists) {
            locationsList.add(listing.location);
          };
        };
      }
    );
    locationsList.toArray();
  };

  public query ({ caller }) func countListingsByPropertyType() : async (Nat, Nat) {
    var kosCount = 0;
    var kontrakanCount = 0;
    let iter = listings.entries();
    iter.forEach(
      func((_, listing)) {
        if (canViewListing(caller, listing)) {
          switch (listing.propertyType) {
            case (#kos) { kosCount += 1 };
            case (#kontrakan) { kontrakanCount += 1 };
          };
        };
      }
    );
    (kosCount, kontrakanCount);
  };

  public query ({ caller }) func getListingFacilities(listingId : Nat) : async [Facility] {
    switch (listings.get(listingId)) {
      case (null) { [] };
      case (?listing) {
        if (not canViewListing(caller, listing)) {
          Runtime.trap("Unauthorized: Cannot view this listing");
        };
        listing.facilities;
      };
    };
  };
};
