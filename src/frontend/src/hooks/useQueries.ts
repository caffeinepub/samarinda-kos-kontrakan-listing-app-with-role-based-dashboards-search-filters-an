import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Listing, ListingInput, EditRequest, DeleteRequest, UserProfile, ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListing(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getListing(BigInt(id));
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetListingsByOwner(owner: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings', 'owner', owner.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListingsByOwner(owner);
    },
    enabled: !!actor && !isFetching && !!owner,
  });
}

export function useGetListingLocations() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['listing-locations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListingLocations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ListingInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createListing(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, photo }: { listingId: bigint; photo: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPhoto(listingId, photo);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useSubmitEditRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, editedListing }: { listingId: bigint; editedListing: Listing }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitEditRequest(listingId, editedListing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edit-requests'] });
    },
  });
}

export function useSubmitDeleteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDeleteRequest(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-requests'] });
    },
  });
}

export function useGetAllEditRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<EditRequest[]>({
    queryKey: ['edit-requests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEditRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDeleteRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<DeleteRequest[]>({
    queryKey: ['delete-requests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDeleteRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProcessEditRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, approved, rejectionReason }: { listingId: bigint; approved: boolean; rejectionReason: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.processEditRequest(listingId, approved, rejectionReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useProcessDeleteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, approved, rejectionReason }: { listingId: bigint; approved: boolean; rejectionReason: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.processDeleteRequest(listingId, approved, rejectionReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-requests'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useApproveListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

