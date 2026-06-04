import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [customerOrders, setCustomerOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);
  const parseItems = (itemsData) => {
  try {
    return JSON.parse(itemsData);
  } catch {
    return [];
  }
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/orders/");
      setOrders(response.data);
    } catch (error) {
      console.log("Profile orders fetch failed:", error);
    }
  };

  const searchCustomerProfile = () => {
    if (!searchPhone.trim()) {
      alert("Please enter phone number");
      return;
    }

    const matchedOrders = orders.filter(
      (order) => order.phone_number === searchPhone.trim()
    );

    setCustomerOrders(matchedOrders);
    setSearched(true);
  };

  const totalSpent = customerOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.total_price || 0), 0);

  const deliveredCount = customerOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledCount = customerOrders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const latestCustomer = customerOrders[0];

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
                Customer Profile
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold">
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]"
            >
              Farms
            </Link>

           <Link
  to="/my-orders"
  className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
>
  My Orders
</Link>

            <Link
              to="/profile"
              className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="px-4 py-14 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D] text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-lime-200 font-black text-[#0F5132]">
            👤 Customer Account
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black text-[#0F5132]">
            My Profile
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-700 font-semibold">
            Search your profile using your order phone number.
          </p>
        </div>
      </section>

      {/* Search Profile */}
      <section className="px-4 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6">
          <label className="block text-sm font-black text-[#0F5132] mb-2">
            📞 Enter Registered Phone Number
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Enter 10 digit phone number"
              className="flex-1 border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
            />

            <button
              onClick={searchCustomerProfile}
              className="bg-[#0F5132] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
            >
              View Profile
            </button>
          </div>
        </div>
      </section>

      {/* Profile Details */}
      <section className="px-4 py-12">
        {!searched ? (
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">👤</div>
            <h2 className="text-3xl font-black text-[#0F5132] mt-4">
              Search your profile
            </h2>
            <p className="text-gray-600 font-semibold mt-2">
              Enter the phone number used while placing orders.
            </p>
          </div>
        ) : customerOrders.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl p-10 text-center">
            <div className="text-7xl">📦</div>
            <h2 className="text-3xl font-black text-red-600 mt-4">
              No Profile Found
            </h2>
            <p className="text-gray-600 font-semibold mt-2">
              No orders found with this phone number.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Customer Card */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[#0F5132] text-white flex items-center justify-center text-5xl font-black shadow-xl">
                  {latestCustomer.customer_name.charAt(0).toUpperCase()}
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black text-[#0F5132]">
                    {latestCustomer.customer_name}
                  </h2>

                  <p className="text-gray-700 font-bold mt-2">
                    📞 {latestCustomer.phone_number}
                  </p>

                  <p className="text-gray-700 font-bold">
                    📧 {latestCustomer.email || "No email added"}
                  </p>

                  <p className="text-gray-700 font-bold">
                    📍 {latestCustomer.city} - {latestCustomer.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-green-500">
                <p className="font-black text-gray-600">📦 Total Orders</p>
                <h3 className="text-4xl font-black text-[#0F5132] mt-2">
                  {customerOrders.length}
                </h3>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-blue-500">
                <p className="font-black text-gray-600">✅ Delivered</p>
                <h3 className="text-4xl font-black text-blue-600 mt-2">
                  {deliveredCount}
                </h3>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-red-500">
                <p className="font-black text-gray-600">❌ Cancelled</p>
                <h3 className="text-4xl font-black text-red-600 mt-2">
                  {cancelledCount}
                </h3>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-yellow-500">
                <p className="font-black text-gray-600">💰 Total Spent</p>
                <h3 className="text-4xl font-black text-yellow-700 mt-2">
                  ₹{totalSpent}
                </h3>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6">
              <h2 className="text-3xl font-black text-[#0F5132] mb-5">
                🧾 Recent Orders
              </h2>

              <div className="space-y-4">
               {customerOrders.map((order) => {
  const items = parseItems(order.items);

  return (
    <div
      key={order.id}
      className="bg-[#F7FFE7] border border-lime-200 rounded-2xl p-5"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-[#0F5132]">
            Order #{order.id}
          </h3>

          <p className="font-bold text-gray-600 mt-1">
            📅 {new Date(order.created_at).toLocaleString()}
          </p>

          <p className="font-bold text-gray-600">
            💳 {order.payment_method}
          </p>

          <p className="font-bold text-gray-600">
            🧺 {items.length} item types
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-3xl font-black text-[#0F5132]">
            ₹{order.total_price}
          </p>

          <span
  className={`inline-block mt-2 px-4 py-2 rounded-full font-black shadow-md ${
    order.status === "Delivered"
      ? "bg-green-100 text-green-700 border border-green-300"
      : order.status === "Cancelled"
      ? "bg-red-100 text-red-700 border border-red-300"
      : order.status === "Packed"
      ? "bg-blue-100 text-blue-700 border border-blue-300"
      : order.status === "Out for Delivery"
      ? "bg-orange-100 text-orange-700 border border-orange-300"
      : "bg-[#FACC15] text-[#0F5132] border border-yellow-300"
  }`}
>
  {order.status === "Pending" ? "⏳ Pending" : order.status}
</span>
          <button
  type="button"
  onClick={() => downloadInvoice(order)}
  className="block mt-3 bg-[#FACC15] text-[#0F5132] px-5 py-3 rounded-2xl font-black hover:bg-yellow-300 shadow-md border border-yellow-300 hover:scale-105 transition duration-300"
>
  Download Invoice 🧾
</button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              order.status === "Pending"
                ? "w-[20%] bg-yellow-500"
                : order.status === "Packed"
                ? "w-[45%] bg-blue-500"
                : order.status === "Out for Delivery"
                ? "w-[75%] bg-orange-500"
                : order.status === "Delivered"
                ? "w-[100%] bg-green-600"
                : "w-[100%] bg-red-500"
            }`}
          ></div>
        </div>

        <p className="mt-2 text-sm font-bold text-gray-600">
          {order.status === "Pending"
            ? "⏳ Order received. Waiting for packing."
            : order.status === "Packed"
            ? "📦 Your order is packed."
            : order.status === "Out for Delivery"
            ? "🛵 Your order is on the way."
            : order.status === "Delivered"
            ? "✅ Delivered successfully."
            : "❌ Order cancelled."}
        </p>
      </div>

      {/* Items */}
      <div className="mt-5 bg-white rounded-2xl p-4 border border-lime-100">
        <h4 className="font-black text-[#0F5132] mb-3">
          🧺 Ordered Items
        </h4>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#F7FFE7] rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-3xl">{item.emoji}</span>
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

              <p className="font-black text-[#0F5132]">
                ₹{Number(item.price || 0) * Number(item.quantity || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
})}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;