export const API_BASE_URL =
  `${process.env.EXPO_PUBLIC_API_URL}/api` || "http://0.0.0.0:8000/api";

export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred");
  }
  if (response.status === 204) {
    return true;
  }
  return response.json();
};
