import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/orders/");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Backend server is not running. Please start Django server.");
    }
  };

  const parseItems = (itemsData) => {
    try {
      return JSON.parse(itemsData);
    } catch {
      return [];
    }
  };

  const trackOrder = () => {
    if (!orderId.trim() || !phoneNumber.trim()) {
      alert("Please enter Order ID and Phone Number");
      return;
    }

    const foundOrder = orders.find(
      (order) =>
        String(order.id) === String(orderId.trim()) &&
        order.phone_number === phoneNumber.trim()
    );

    setTrackedOrder(foundOrder || null);
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

  const getStatusWidth = (status) => {
    if (status === "Pending") return "w-[20%] bg-yellow-500";
    if (status === "Packed") return "w-[45%] bg-blue-500";
    if (status === "Out for Delivery") return "w-[75%] bg-orange-500";
    if (status === "Delivered") return "w-[100%] bg-green-600";
    return "w-[100%] bg-red-500";
  };

  const getStatusMessage = (status) => {
    if (status === "Pending") return "⏳ Order received. Waiting for packing.";
    if (status === "Packed") return "📦 Your order is packed and ready.";
    if (status === "Out for Delivery") return "🛵 Delivery partner is on the way.";
    if (status === "Delivered") return "✅ Order delivered successfully.";
    return "❌ Order has been cancelled.";
  };

  const items = trackedOrder ? parseItems(trackedOrder.items) : [];

  return (
    <div className="min-h-screen bg-[#F7FFE7] text-gray-900">
      {/* Navbar */}
      <div className="bg-white shadow-md border-b border-lime-100">
        <div className="w-full h-20 flex items-center justify-between gap-4 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={goldenLeafLogo}
              alt="GoldenLeaf Farms Logo"
              className="w-20 h-14 md:w-28 md:h-16 object-contain"
            />

            <div>
              <h1 className="text-xl md:text-3xl font-black text-[#0F5132] tracking-wide uppercase font-serif">
                GoldenLeaf Farms
              </h1>

              <p className="text-xs md:text-sm text-[#7A5C00] font-bold">
                Track Your Order
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold">
            <Link to="/" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              Home
            </Link>

            <Link to="/products" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              Farms
            </Link>

            <Link to="/profile" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              Profile
            </Link>

            <Link to="/track-order" className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md">
              Track
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="px-4 py-14 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D] text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-lime-200 font-black text-[#0F5132]">
            📦 Live Tracking
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black text-[#0F5132]">
            Track Your Order
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-700 font-semibold">
            Enter your Order ID and phone number to check live order status.
          </p>
        </div>
      </section>

      {/* Search Box */}
      <section className="px-4 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-black text-[#0F5132] mb-2">
                🧾 Order ID
              </label>

              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Example: 12"
                className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#0F5132] mb-2">
                📞 Phone Number
              </label>

              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="10 digit phone number"
                className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={trackOrder}
                className="w-full bg-[#0F5132] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
              >
                Track Order 🔍
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="px-4 py-12">
        {errorMessage ? (
          <div className="max-w-4xl mx-auto bg-red-50 border-2 border-red-300 rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">⚠️</div>
            <h2 className="text-3xl font-black text-red-600 mt-4">
              Connection Error
            </h2>
            <p className="text-gray-700 font-semibold mt-2">{errorMessage}</p>
          </div>
        ) : !searched ? (
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">📦</div>
            <h2 className="text-3xl font-black text-[#0F5132] mt-4">
              Ready to track
            </h2>
            <p className="text-gray-600 font-semibold mt-2">
              Enter your order details above.
            </p>
          </div>
        ) : !trackedOrder ? (
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">❌</div>
            <h2 className="text-3xl font-black text-red-600 mt-4">
              Order Not Found
            </h2>
            <p className="text-gray-600 font-semibold mt-2">
              Please check Order ID and phone number.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Order Card */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0F5132] to-[#65A30D] text-white p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-black">
                      Order #{trackedOrder.id}
                    </h2>
                    <p className="text-green-100 font-semibold mt-2">
                      Placed on {new Date(trackedOrder.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-4xl font-black">
                      ₹{trackedOrder.total_price}
                    </p>
                    <span className="inline-block mt-2 bg-[#FACC15] text-[#0F5132] px-4 py-2 rounded-full font-black">
                      {trackedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Progress */}
                <h3 className="text-2xl font-black text-[#0F5132]">
                  🚚 Delivery Status
                </h3>

                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${getStatusWidth(
                      trackedOrder.status
                    )}`}
                  ></div>
                </div>

                <p className="mt-3 font-bold text-gray-700">
                  {getStatusMessage(trackedOrder.status)}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 p-3 rounded-2xl text-center font-black">
                    ⏳ Received
                  </div>

                  <div className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-2xl text-center font-black">
                    📦 Packed
                  </div>

                  <div className="bg-orange-50 text-orange-700 border border-orange-200 p-3 rounded-2xl text-center font-black">
                    🛵 On Way
                  </div>

                  <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-2xl text-center font-black">
                    ✅ Delivered
                  </div>
                </div>
              </div>
            </div>

            {/* Customer + Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-[2rem] shadow-xl border border-lime-200 p-6 h-fit">
                <h3 className="text-2xl font-black text-[#0F5132]">
                  👤 Customer Details
                </h3>

                <div className="mt-4 space-y-2 font-bold text-gray-700">
                  <p>👤 {trackedOrder.customer_name}</p>
                  <p>📞 {trackedOrder.phone_number}</p>
                  <p>📧 {trackedOrder.email || "No email"}</p>
                  <p>📍 {trackedOrder.address}</p>
                  <p>
                    🏙️ {trackedOrder.city} - {trackedOrder.pincode}
                  </p>
                  <p>💳 {trackedOrder.payment_method}</p>
                </div>

                <button
                  onClick={() => downloadInvoice(trackedOrder)}
                  className="w-full mt-6 bg-[#FACC15] text-[#0F5132] px-5 py-3 rounded-2xl font-black hover:bg-yellow-300 shadow-md border border-yellow-300"
                >
                  Download Invoice 🧾
                </button>
              </div>

              <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl border border-lime-200 p-6">
                <h3 className="text-2xl font-black text-[#0F5132]">
                  🧺 Ordered Items
                </h3>

                <div className="mt-5 space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#F7FFE7] border border-lime-200 rounded-2xl p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-contain"
                          />
                        ) : (
                          <span className="text-4xl">{item.emoji}</span>
                        )}

                        <div>
                          <p className="font-black text-gray-800">
                            {item.emoji} {item.name}
                          </p>

                          <p className="text-sm text-gray-600 font-bold">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-black text-[#0F5132] text-xl">
                        ₹{Number(item.price || 0) * Number(item.quantity || 0)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-green-50 border border-green-300 rounded-2xl p-4">
                  <p className="font-bold">Delivery Fee: ₹{trackedOrder.delivery_fee || 0}</p>
                  <p className="font-bold">Tip: ₹{trackedOrder.tip_amount || 0}</p>
                  <p className="text-2xl font-black text-[#0F5132] mt-2">
                    Final Total: ₹{trackedOrder.total_price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default TrackOrder;