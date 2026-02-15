import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import type { UserProfile, UserRole } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return async (profile: UserProfile) => {
    if (!actor) throw new Error('Actor not available');
    await actor.saveCallerUserProfile(profile);
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  };
}

export function useAuth() {
  const { identity, clear: clearIdentity, login, loginStatus } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: role } = useGetCallerUserRole();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const logout = async () => {
    await clearIdentity();
    queryClient.clear();
  };

  return {
    identity,
    profile,
    role,
    isAuthenticated,
    profileLoading,
    isFetched,
    login,
    logout,
    loginStatus,
  };
}

