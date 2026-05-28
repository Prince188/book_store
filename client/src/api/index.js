import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

export const getBooks = (params) => API.get('/books', { params });
export const getBook = (id) => API.get(`/books/${id}`);
export const createBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

export const getCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (bookId, data) => API.put(`/cart/${bookId}`, data);
export const removeFromCart = (bookId) => API.delete(`/cart/${bookId}`);

export const getFavorites = () => API.get('/favorites');
export const toggleFavorite = (bookId) => API.post(`/favorites/${bookId}`);

export const createOrder = () => API.post('/orders');
export const getOrders = () => API.get('/orders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders/all');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getSalesStats = () => API.get('/orders/stats/sales');
export const downloadInvoice = (id) => API.get(`/orders/${id}/invoice`, { responseType: 'blob' });

export const getBookReviews = (bookId) => API.get(`/reviews/${bookId}`);
export const getMyReview = (bookId) => API.get(`/reviews/${bookId}/mine`);
export const createReview = (bookId, data) => API.post(`/reviews/${bookId}`, data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

export const createStockAlert = (bookId) => API.post(`/stock-alerts/${bookId}`);
export const getMyStockAlerts = () => API.get('/stock-alerts');
export const deleteStockAlert = (bookId) => API.delete(`/stock-alerts/${bookId}`);

export const createTicket = (data) => API.post('/tickets', data);
export const getMyTickets = () => API.get('/tickets');
export const getTicket = (id) => API.get(`/tickets/${id}`);
export const getAllTickets = () => API.get('/tickets/all');
export const replyTicket = (id, data) => API.post(`/tickets/${id}/reply`, data);
export const updateTicketStatus = (id, data) => API.put(`/tickets/${id}/status`, data);

export const getAllUsers = () => API.get('/auth/users');
export const updateUserRole = (id, data) => API.put(`/auth/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/auth/users/${id}`);
