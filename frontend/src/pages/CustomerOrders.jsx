import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerOrders, setCustomerOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
  "https://goldenleaf-backend.onrender.com/api/orders/"
);
      setOrders(response.data);
    } catch (error) {
      console.log("Orders fetch failed:", error);
      alert("Backend server is not running");
    }
  };

  const parseItems = (itemsData) => {
    try {
      return JSON.parse(itemsData);
    } catch {
      return [];
    }
  };

  const searchMyOrders = () => {
    if (!phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }

    const matchedOrders = orders.filter(
      (order) => order.phone_number === phoneNumber.trim()
    );

    setCustomerOrders(matchedOrders);
    setSearched(true);
  };

  const downloadInvoice = (order) => {
    const items = parseItems(order.items);

    const productsTotal = items.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    const deliveryFee = Number(order.delivery_fee || 0);
    const tipAmount = Number(order.tip_amount || 0);
    const finalAmount = Number(order.total_price || 0);

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("GoldenLeaf Farms Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: #${order.id}`, 20, 35);
    doc.text(`Customer: ${order.customer_name}`, 20, 45);
    doc.text(`Phone: ${order.phone_number}`, 20, 55);
    doc.text(`Email: ${order.email || "No email"}`, 20, 65);
    doc.text(`Address: ${order.address}`, 20, 75);
    doc.text(`City: ${order.city} - ${order.pincode}`, 20, 85);
    doc.text(`Payment: ${order.payment_method}`, 20, 95);
    doc.text(`Status: ${order.status}`, 20, 105);

    doc.setFontSize(14);
    doc.text("Items:", 20, 122);

    let y = 135;

    items.forEach((item, index) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);
      const itemTotal = price * quantity;

      doc.setFontSize(11);
      doc.text(
        `${index + 1}. ${item.name} - Rs.${price} x ${quantity} = Rs.${itemTotal}`,
        20,
        y
      );

      y += 10;
    });

    y += 8;

    doc.setFontSize(13);
    doc.text(`Products Total: Rs.${productsTotal}`, 20, y);
    doc.text(`Delivery Fee: Rs.${deliveryFee}`, 20, y + 10);
    doc.text(`Tip: Rs.${tipAmount}`, 20, y + 20);

    doc.setFontSize(16);
    doc.text(`Final Amount: Rs.${finalAmount}`, 20, y + 35);

    doc.setFontSize(11);
    doc.text("Thank you for shopping with GoldenLeaf Farms", 20, y + 50);

    doc.save(`goldenleaf_invoice_order_${order.id}.pdf`);
  };

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700 border-green-300";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700 border-red-300";
    }

    if (status === "Packed") {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }

    if (status === "Out for Delivery") {
      return "bg-orange-100 text-orange-700 border-orange-300";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  const getStatusMessage = (status) => {
    if (status === "Delivered") return "Your order was delivered successfully.";
    if (status === "Cancelled") return "Your order was cancelled.";
    if (status === "Packed") return "Your order is packed with love and care.";
    if (status === "Out for Delivery") return "Your order is on the way.";
    return "Your order is being packed with love and care 💚";
  };

  return (
    <div className="min-h-screen bg-[#F7FFE7] text-gray-900">
      {/* Customer Navbar */}
      <div className="fixed top-0 left-0 w-full z-[200] bg-white shadow-md border-b border-lime-100">
        <div className="w-full h-20 flex items-center justify-between gap-4 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={goldenLeafLogo}
              alt="GoldenLeaf Farms Logo"
              className="w-20 h-14 md:w-28 md:h-16 object-contain"
            />

            <div>
              <h1 className="text-xl md:text-3xl font-black text-[#0F5132] tracking-wide whitespace-nowrap uppercase font-serif">
                GoldenLeaf Farms
              </h1>

              <p className="text-xs md:text-sm text-[#7A5C00] font-bold">
                Customer Orders
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold">
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
            >
              Farms
            </Link>

            <Link
              to="/my-orders"
              className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md"
            >
              My Orders
            </Link>

            <Link
              to="/profile"
              className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="pt-32 px-4 pb-10 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D] text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-lime-200 font-black text-[#0F5132]">
            🧾 Customer Order History
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-[#0F5132]">
            My Orders
          </h1>

          <p className="mt-4 text-lg text-gray-700 font-semibold">
            Enter your phone number to view your GoldenLeaf Farms orders.
          </p>
        </div>
      </section>

      {/* Search Box */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6">
          <label className="block text-sm font-black text-[#0F5132] mb-2">
            📞 Registered Phone Number
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10 digit phone number"
              className="flex-1 border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
            />

            <button
              onClick={searchMyOrders}
              className="bg-[#0F5132] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
            >
              View My Orders
            </button>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="px-4 py-12">
        {!searched ? (
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">📦</div>
            <h2 className="text-3xl font-black text-[#0F5132] mt-4">
              Search your orders
            </h2>
            <p className="text-gray-600 font-semibold mt-2">
              Enter the phone number used while placing order.
            </p>
          </div>
        ) : customerOrders.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">❌</div>
            <h2 className="text-3xl font-black text-red-600 mt-4">
              No Orders Found
            </h2>
            <p className="text-gray-600 font-semibold mt-2">
              No orders found with this phone number.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {customerOrders.map((order) => {
              const items = parseItems(order.items);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#0F5132] to-[#65A30D] text-white p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black">
                        Order #{order.id}
                      </h2>

                      <p className="text-green-100 font-semibold mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-3xl font-black">
                        ₹{order.total_price}
                      </p>

                      <span
                        className={`inline-block mt-2 px-4 py-2 rounded-full border font-black ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="bg-[#F7FFE7] border border-lime-200 rounded-2xl p-4 mb-5">
                      <p className="font-black text-[#0F5132]">
                        {getStatusMessage(order.status)}
                      </p>
                    </div>

                    <h3 className="text-2xl font-black text-[#0F5132] mb-4">
                      🧺 Ordered Items
                    </h3>

                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-[#F7FFE7] border border-lime-200 rounded-2xl p-4 flex justify-between items-center gap-4"
                        >
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-contain bg-white rounded-xl p-1"
                              />
                            ) : (
                              <span className="text-3xl">{item.emoji}</span>
                            )}

                            <div>
                              <p className="font-black text-gray-800">
                                {item.emoji} {item.name}
                              </p>

                              <p className="text-sm font-bold text-gray-600">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          <p className="font-black text-[#0F5132]">
                            ₹{Number(item.price || 0) *
                              Number(item.quantity || 0)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="bg-[#FACC15] text-[#0F5132] py-3 rounded-2xl font-black hover:bg-yellow-300 shadow-md"
                      >
                        Download Invoice 🧾
                      </button>

                      <Link
                        to="/products"
                        className="text-center bg-[#0F5132] text-white py-3 rounded-2xl font-black hover:bg-[#0b3f27] shadow-md"
                      >
                        Continue Shopping 🧺
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default CustomerOrders;