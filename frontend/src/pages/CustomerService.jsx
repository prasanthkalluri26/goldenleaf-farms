import { useState } from "react";
import { Link } from "react-router-dom";
import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";
import axios from "axios";


function CustomerService() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderId: "",
    issueType: "Order Issue",
    message: "",
  });
const [trackPhone, setTrackPhone] = useState("");
const [myRequests, setMyRequests] = useState([]);
const [searchedRequests, setSearchedRequests] = useState(false);
const [loadingRequests, setLoadingRequests] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitSupport = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.phone || !formData.message) {
    alert("Please fill name, phone number and message");
    return;
  }

  try {
   await axios.post("https://goldenleaf-backend.onrender.com/api/support/", {
  name: formData.name,
  phone: formData.phone,
  order_id: formData.orderId,
  issue_type: formData.issueType,
  message: formData.message,
});

    alert("Your support request submitted successfully 💚");

    setFormData({
      name: "",
      phone: "",
      orderId: "",
      issueType: "Order Issue",
      message: "",
    });
  } catch (error) {
    console.log("SUPPORT ERROR:", error);
    console.log("BACKEND ERROR:", error.response?.data);

    alert(
      error.response?.data
        ? JSON.stringify(error.response.data)
        : "Support request failed"
    );
  }
};

  const whatsappText = `Hi GoldenLeaf Farms Support,

I need help with my order.

Name: ${formData.name}
Phone: ${formData.phone}
Order ID: ${formData.orderId || "Not added"}
Issue: ${formData.issueType}
Message: ${formData.message}`;

const checkMySupportRequests = async () => {
  const phone = trackPhone.trim();

  if (!phone) {
    alert("Please enter phone number");
    return;
  }

  try {
    setLoadingRequests(true);

    const response = await axios.get(
      `https://goldenleaf-backend.onrender.com/api/support/?phone=${phone}`
    );

    setMyRequests(response.data || []);
    setSearchedRequests(true);
  } catch (error) {
    console.log("CHECK SUPPORT ERROR:", error);
    alert("Failed to load your support requests");
  } finally {
    setLoadingRequests(false);
  }
};

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
                Customer Service
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 font-bold">
            <Link to="/" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              Home
            </Link>
            <Link to="/products" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              Farms
            </Link>
            <Link to="/my-orders" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              My Orders
            </Link>
            <Link to="/profile" className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]">
              Profile
            </Link>
            <Link to="/customer-service" className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md">
              Support
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="px-4 py-14 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D] text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-lime-200 font-black text-[#0F5132]">
            🎧 24/7 Customer Help
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black text-[#0F5132]">
            Customer Service
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-700 font-semibold">
            Need help with your order, delivery, payment, or product quality?
          </p>
        </div>
      </section>

{/* Check Support Request Status */}
<section className="px-4 py-8 bg-[#F7FFE7]">
  <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6">
    <h2 className="text-2xl md:text-3xl font-black text-[#0F5132]">
      🔍 Check My Complaint Status
    </h2>

    <p className="text-gray-600 font-semibold mt-2">
      Enter your phone number to view your complaint status.
    </p>

    <div className="flex flex-col md:flex-row gap-3 mt-5">
      <input
        type="text"
        value={trackPhone}
        onChange={(e) => setTrackPhone(e.target.value)}
        placeholder="Enter your phone number"
        className="flex-1 border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
      />

      <button
        type="button"
        onClick={checkMySupportRequests}
        disabled={loadingRequests}
        className="bg-[#0F5132] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg disabled:bg-gray-400"
      >
        {loadingRequests ? "Checking..." : "Check Status"}
      </button>
    </div>

    {searchedRequests && (
      <div className="mt-6">
        {myRequests.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-red-600 font-black">
              No complaint found for this phone number.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myRequests.map((request) => (
              <div
                key={request.id}
                className="bg-[#F7FFE7] border border-lime-200 rounded-2xl p-5 shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-black text-[#0F5132] text-xl">
                      Complaint #{request.id}
                    </p>

                    <p className="font-bold text-gray-700 mt-1">
                      🧾 Order ID: {request.order_id || "Not added"}
                    </p>

                    <p className="font-bold text-gray-700">
                      📌 Issue: {request.issue_type}
                    </p>

                    <p className="font-bold text-gray-500">
                      📅 {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-block px-5 py-2 rounded-full font-black shadow-md ${
                        request.status === "Resolved"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : request.status === "In Progress"
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      }`}
                    >
                      {request.status === "Resolved"
                        ? "✅ Resolved"
                        : request.status === "In Progress"
                        ? "🔧 In Progress"
                        : "🆕 New"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-2xl p-4 border border-lime-100">
                  <p className="font-black text-[#0F5132] mb-1">
                    Your Message:
                  </p>

                  <p className="font-bold text-gray-700">
                    {request.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
</section>


      {/* Content */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F5132] to-[#65A30D] text-white p-6">
              <h2 className="text-3xl font-black">Submit Support Request</h2>
              <p className="text-green-100 font-semibold mt-1">
                Our team will help you as soon as possible.
              </p>
            </div>

            <form onSubmit={submitSupport} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-[#0F5132] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-[#0F5132] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-[#0F5132] mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="Example: 12"
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-[#0F5132] mb-2">
                    Issue Type
                  </label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-bold"
                  >
                    <option>Order Issue</option>
                    <option>Delivery Issue</option>
                    <option>Payment Issue</option>
                    <option>Product Quality Issue</option>
                    <option>Cancel Order</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-[#0F5132] mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Explain your issue clearly..."
                  className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-bold resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F5132] text-white py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
                >
                  Submit Request ✅
                </button>

                <a
                  href={`https://wa.me/918686336040?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-[#25D366] text-white py-4 rounded-2xl font-black hover:bg-green-500 shadow-lg"
                >
                  WhatsApp Support 💬
                </a>
              </div>
            </form>
          </div>

          {/* Help Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-[2rem] shadow-xl border border-lime-200 p-6">
              <h3 className="text-2xl font-black text-[#0F5132]">
                📞 Contact
              </h3>
              <p className="font-bold text-gray-700 mt-3">
                Phone: +91 8686336040
              </p>
              <p className="font-bold text-gray-700 mt-2">
                Email: support@goldenleaf.com
              </p>
              <p className="font-bold text-gray-700 mt-2">
                Timing: 9 AM - 9 PM
              </p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl border border-lime-200 p-6">
              <h3 className="text-2xl font-black text-[#0F5132]">
                ❓ Quick Help
              </h3>

              <div className="mt-4 space-y-3">
                <div className="bg-[#F7FFE7] rounded-2xl p-4">
                  <p className="font-black text-[#0F5132]">
                    Where is my order?
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    Go to My Orders and enter your phone number.
                  </p>
                </div>

                <div className="bg-[#F7FFE7] rounded-2xl p-4">
                  <p className="font-black text-[#0F5132]">
                    How to download invoice?
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    Open My Orders and click Download Invoice.
                  </p>
                </div>

                <div className="bg-[#F7FFE7] rounded-2xl p-4">
                  <p className="font-black text-[#0F5132]">
                    Product damaged?
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    Submit a support request with order ID.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/my-orders"
              className="block text-center bg-[#FACC15] text-[#0F5132] py-4 rounded-2xl font-black shadow-lg hover:bg-yellow-300"
            >
              Check My Orders 📦
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerService;