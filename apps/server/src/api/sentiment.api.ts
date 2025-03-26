// /home/nate/Dungeon/Personal/sentiment-hound-v2/apps/server/src/api/sentiment.api.ts

const API_BASE_URL = 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getSentimentAnalysis(
  text: string,
): Promise<ApiResponse<any>> {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  };
  return fetchApi<any>('/sentiment-analysis', options);
}

export async function getSentimentHistory(
  userId: string,
): Promise<ApiResponse<any>> {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return fetchApi<any>(`/sentiment-history/${userId}`, options);
}
