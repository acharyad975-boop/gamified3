/**
 * API Client for interacting with Django REST Framework backend.
 */

const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && (data.detail === 'Invalid token.' || data.error === 'Invalid token.')) {
          this.setToken(null);
        }
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error('The login server is not running. Start Django with: python manage.py runserver');
        }
        throw new Error(data.error || data.detail || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Cannot reach the login server. Make sure Django is running on port 8000.');
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
