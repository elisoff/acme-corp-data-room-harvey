// Fetcher function for SWR
export async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}

export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 1000 * 60 * 5, // 5 minutes
  errorRetryCount: 1,
};

export async function sendRequest(
  url: string,
  { method, body = {} }: { method: string; body?: Record<string, unknown> }
) {
  return fetch(url, {
    method,
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw new Error(res.statusText);
    })
    .catch((err) => {
      console.error("Error sending request:", err);
      throw err;
    });
}
