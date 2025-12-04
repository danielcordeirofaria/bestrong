const BASE_URL = '/api';

async function handleApiResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || `Erro na API: ${response.status}`);
  }
  return response.json();
}

const productsApi = {

  create: async (formData) => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',

      body: formData,
    });
    return handleApiResponse(response);
  },


  getAll: async () => {
    const response = await fetch(`${BASE_URL}/products`);
    return handleApiResponse(response);
  },


  getById: async (productId) => {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    return handleApiResponse(response);
  },

};

export default productsApi;