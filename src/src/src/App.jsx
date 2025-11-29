import React, { useState, useEffect } from 'react';

const menuData = [
  { id: 1, category: 'Appetizers', name: 'Samosa', price: 5.00 },
  { id: 2, category: 'Appetizers', name: 'Spring Rolls', price: 6.50 },
  { id: 3, category: 'Main Courses', name: 'Butter Chicken', price: 15.99 },
  { id: 4, category: 'Main Courses', name: 'Vegetable Biryani', price: 13.50 },
  { id: 5, category: 'Main Courses', name: 'Lamb Curry', price: 18.75 },
  { id: 6, category: 'Drinks', name: 'Coca-Cola', price: 2.00 },
  { id: 7, category: 'Drinks', name: 'Mango Lassi', price: 4.50 },
  { id: 8, category: 'Desserts', name: 'Gulab Jamun', price: 5.50 },
];

const Menu = ({ addToOrder }) => {
  const categories = [...new Set(menuData.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Menu</h2>

      <div className="flex space-x-3 mb-4 overflow-x-auto whitespace-nowrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`py-2 px-4 rounded-full text-sm font-medium transition duration-150 ${
              activeCategory === category
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {menuData
          .filter(item => item.category === activeCategory)
          .map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition duration-150 rounded-md">
              <div>
                <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-lg font-bold text-red-600">${item.price.toFixed(2)}</p>
                <button
                  onClick={() => addToOrder(item)}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-150 text-sm font-medium shadow-md"
                  aria-label={`Add ${item.name} to order`}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const OrderPanel = ({ order, removeFromOrder, processOrder }) => {
  const subtotal = order.reduce((sum, item) => sum + item.price, 0);
  const taxRate = 0.05; 
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Current Order</h2>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {order.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Order is empty. Add items from the menu.</p>
        ) : (
          order.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border border-gray-200">
              <p className="text-base font-medium text-gray-900">{item.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-base font-semibold text-red-600">${item.price.toFixed(2)}</p>
                <button
                  onClick={() => removeFromOrder(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 transition duration-150 text-xs font-medium"
                  aria-label={`Remove ${item.name}`}
                >
                  X
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%):</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => processOrder(total)}
          disabled={order.length === 0}
          className={`w-full mt-4 py-3 rounded-lg text-white text-lg font-bold transition duration-300 shadow-lg ${
            order.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Process Order (${total.toFixed(2)})
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [order, setOrder] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const addToOrder = (item) => {
    setOrder([...order, item]);
    setMessage(`${item.name} added.`);
    setShowMessage(true);
  };

  const removeFromOrder = (indexToRemove) => {
    setOrder(order.filter((_, index) => index !== indexToRemove));
  };

  const processOrder = (total) => {
    setIsProcessing(true);
    setMessage(`Processing payment of $${total.toFixed(2)}...`);
    setShowMessage(true);

    setTimeout(() => {
      setIsProcessing(false);
      setMessage(`Order successfully processed! Total: $${total.toFixed(2)}`);
      setShowMessage(true);
      setOrder([]); 
    }, 2000); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-red-700">The Kiosk App</h1>
        <p className="text-gray-600">Place Your Order</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
        <div className="lg:col-span-2">
          <Menu addToOrder={addToOrder} />
        </div>
        <div className="lg:col-span-1">
          <OrderPanel 
            order={order} 
            removeFromOrder={removeFromOrder} 
            processOrder={processOrder}
          />
        </div>
      </main>

      {showMessage && (
        <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-3 rounded-lg shadow-xl text-white font-medium z-50 transition-opacity duration-300 ${isProcessing ? 'bg-orange-500' : 'bg-blue-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
