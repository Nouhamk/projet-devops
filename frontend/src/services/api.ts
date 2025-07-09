const API_URL = import.meta.env.VITE_API_URL;

const api = {
  request: async (endpoint: string, options: RequestInit = {}) => {
    // Ajouter le token d'authentification s'il existe
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    // Préparer les options de la requête
    const config = {
      ...options,
      headers
    };

    // Effectuer la requête
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Vérifier si la réponse est OK
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message ?? JSON.stringify(errorData);
      } catch {
        errorMessage = response.statusText;
      }
      return Promise.reject(new Error(errorMessage));
    }
    
    // Si la réponse est vide, retourner null
    if (response.status === 204) {
      return null;
    }
    
    // Sinon, parser la réponse en JSON
    return await response.json();
  },
  
  get: (endpoint: string) => {
    return api.request(endpoint);
  },
  
  post: (endpoint: string, data: any) => {
    return api.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint: string, data: any) => {
    return api.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: (endpoint: string) => {
    return api.request(endpoint, {
      method: 'DELETE'
    });
  }
};

export default api;