import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getOrders } from '../api';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getOrders()
        .then((res) => setOrders(res.data))
        .catch(() => { })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const statusConfig = {
    pending: {
      color: 'bg-amber-100 text-amber-700',
      icon: '⏳',
      label: 'Pending',
      description: 'Your order is being processed'
    },
    processing: {
      color: 'bg-blue-100 text-blue-700',
      icon: '🔄',
      label: 'Processing',
      description: 'We are preparing your order'
    },
    shipped: {
      color: 'bg-purple-100 text-purple-700',
      icon: '📦',
      label: 'Shipped',
      description: 'Your order is on the way'
    },
    delivered: {
      color: 'bg-green-100 text-green-700',
      icon: '✅',
      label: 'Delivered',
      description: 'Your order has been delivered'
    },
    cancelled: {
      color: 'bg-red-100 text-red-700',
      icon: '❌',
      label: 'Cancelled',
      description: 'Your order has been cancelled'
    },
  };

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.pending;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">Orders are Locked</h2>
          <p className="text-stone-600 mb-6">
            Please login to view your order history and track your purchases.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/books"
              className="px-6 py-3 border border-amber-200 text-stone-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-stone-500">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">My Orders</span>
          </nav>

          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 flex items-center gap-3">
                <span>📦</span>
                My Orders
                <span className="text-lg font-normal text-stone-500 bg-white px-3 py-1 rounded-full">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </h1>
              <p className="text-stone-500 mt-2">Track and manage your purchases</p>
            </div>
            {orders.length > 0 && (
              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                <span>+</span>
                Continue Shopping
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl border border-amber-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 bg-amber-100 rounded w-32"></div>
                    <div className="h-6 bg-amber-100 rounded w-24"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 bg-amber-50 rounded"></div>
                    <div className="h-12 bg-amber-50 rounded"></div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-6 bg-amber-100 rounded w-24"></div>
                    <div className="h-8 bg-amber-100 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-12 text-center">
            <div className="text-8xl mb-6">📦📖</div>
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">No Orders Yet</h2>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start exploring our collection and make your first purchase!
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>📚</span>
              Start Shopping
              <span>→</span>
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              const orderDate = new Date(order.createdAt);
              const isExpanded = selectedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-amber-50">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-mono text-stone-500 bg-amber-50 px-3 py-1 rounded-full">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                            <span>{statusInfo.icon}</span>
                            <span>{statusInfo.label}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-500">
                          <span>📅 {orderDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                          <span>⏰ {orderDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        <p className="text-sm text-stone-600">{statusInfo.description}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-700">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setSelectedOrder(isExpanded ? null : order._id)}
                      className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? 'Hide Details ↑' : 'View Details ↓'}
                    </button>
                  </div>

                  {/* Order Items (Expandable) */}
                  {isExpanded && (
                    <div className="p-6 bg-amber-50/30 animate-slideDown">
                      <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                        <span>📚</span>
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={item._id || idx} className="flex items-center gap-4 bg-white rounded-xl p-3 border border-amber-100">
                            <div className="flex-1">
                              <Link
                                to={`/books/${item.book?._id}`}
                                className="font-medium text-stone-800 hover:text-amber-600 transition-colors"
                              >
                                {item.book?.title || 'Book'}
                              </Link>
                              <p className="text-sm text-stone-500">${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-stone-600">Qty: {item.quantity}</span>
                              <div className="w-px h-6 bg-amber-200"></div>
                              <span className="font-semibold text-amber-700">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stone-600">Subtotal</span>
                          <span className="text-stone-800">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-stone-600">Shipping</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold mt-3 pt-3 border-t border-amber-200">
                          <span className="text-stone-800">Total</span>
                          <span className="text-amber-700">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Shipping Address (if available) */}
                      {order.shippingAddress && (
                        <div className="mt-4 pt-4 border-t border-amber-200">
                          <h4 className="text-sm font-semibold text-stone-700 mb-2">Shipping Address</h4>
                          <p className="text-sm text-stone-600">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Reorder Section */}
        {orders.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-serif font-bold text-stone-800 text-lg">Love what you bought?</h3>
                <p className="text-stone-600 text-sm">Discover more books from your favorite categories</p>
              </div>
              <Link
                to="/books"
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Orders;