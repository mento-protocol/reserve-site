import { Network } from "@/types";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface AddressGroup {
  label: string;
  addresses: Array<{ address: string; network: Network }>;
}

export const useReserveAddresses = () => {
  const { data, error, isLoading } = useSWR<Record<string, AddressGroup>>(
    "/api/reserve-addresses",
    fetcher,
  );

  return {
    addresses: data || {},
    error,
    isLoading,
  };
};
