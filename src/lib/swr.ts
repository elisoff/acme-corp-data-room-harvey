// Fetcher function for SWR
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 1000 * 60 * 5, // 5 minutes
  errorRetryCount: 1,
};
