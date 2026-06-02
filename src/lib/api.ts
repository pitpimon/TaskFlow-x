/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE_URL = 'http://localhost:3001/api';

export function getHeaders(): HeadersInit {
  const token = localStorage.getItem('taskflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }

  return response.json() as Promise<T>;
}
