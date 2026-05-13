import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("maison_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("maison_token");
      localStorage.removeItem("maison_current_user");
    }
    return Promise.reject(error);
  }
);

// ===== AUTH =====
export const authApi = {
  login: async (data: any) => {
    const res = await api.post("/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("maison_token", res.data.token);
    }
    return res;
  },

  register: (data: any) => api.post("/auth/register", data),

  getCurrentUser: () => api.get("/auth/me"),

  updateProfile: (data: any) => api.put("/auth/profile", data),

  logout: () => {
    localStorage.removeItem("maison_token");
    return Promise.resolve();
  },
};

// ===== PRODUCTS =====
export const productsApi = {
  getApproved: () =>
    api.get("/products"),

  getAllAdmin: () =>
    api.get("/products/all"),

  getById: (id: string) =>
    api.get(`/products/${id}`),

  getByVendor: (vendorId: string) =>
    api.get(`/products/vendor/${vendorId}`),

  create: (data: FormData) =>
  api.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  bulkUpload: (data: FormData) =>
  api.post("/products/bulk-upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  update: (id: string, data: FormData) =>
  api.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),


  delete: (id: string) =>
    api.delete(`/products/${id}`),

  toggleApproval: (id: string) =>
    api.put(`/products/${id}/approve`),

  toggleBestSeller: (id: string) =>
  api.patch(`/products/${id}/best-seller`),
};




// ===== ORDERS =====
export const ordersApi = {
  getByCustomer: (customerId: string) =>
  api.get(`/orders/customer/${customerId}`),
  
  track: (id: string) =>
  api.get(`/orders/track/${id}`),

  create: (data: any) =>
  api.post("/orders", data),

  getAll: () =>
    api.get("/orders"),

  getById: (id: string) =>
    api.get(`/orders/${id}`),

  getByVendor: (vendorId: string) =>
    api.get(`/orders/vendor/${vendorId}`),

  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};




// ===== USERS =====
export const usersApi = {
  getAll: () =>
    api.get("/users"),

  updateStatus: (id: string, status: string) =>
    api.put(`/users/${id}/status`, { status }),

  deleteUser: (id: string) =>
    api.delete(`/users/${id}`),
};




// ===== ANALYTICS =====
export const analyticsApi = {
  getStats: () =>
    api.get("/analytics"),

  getVendorStats: (vendorId: string) =>
    api.get(`/analytics/vendor/${vendorId}`),

  getAdminStats: () =>
    api.get("/analytics/admin"),
};



// ===== SEARCH =====
export const searchApi = {
  search: (query: string) =>
    api.get(`/products/search?q=${query}`),
};

export default api;

export type ManagedProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  approved?: boolean;
  vendor?: string;
  discount?: number;
  isBestSeller?: boolean;
};


export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    vendorId: string;
    productName: string;
  }[];
};




