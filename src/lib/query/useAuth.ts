"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, login, register, updateProfile } from "@/lib/api/auth";
import { QUERY_KEYS } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth";

/**
 * Hook login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

/**
 * Hook register
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useProfile = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: getProfile,
    enabled: !!token,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(QUERY_KEYS.PROFILE, user);
    },
  });
};
