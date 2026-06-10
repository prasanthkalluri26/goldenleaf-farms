import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

const SUPPORT_API_URL = "https://goldenleaf-backend.onrender.com/api/support/";

function SupportAdmin() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAccess, setAdminAccess] = useState(false);
  const [searchText, setSearchText] = useState("");

  const checkAdminPassword = () => {
    if (adminPassword === "6202") {
      setAdminAccess(true);
      setAdminPassword("");
    } else {
      alert("Wrong admin password");
    }
  };

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SUPPORT_API_URL);
      setSupportRequests(response.data);
    } catch (error) {
      console.log("SUPPORT ADMIN ERROR:", error);
      alert("Failed to load support requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminAccess) {
      fetchSupportRequests();
    }
  }, [adminAccess]);

  const filteredRequests = supportRequests.filter((request) => {
    const text = searchText.toLowerCase();

    return (
      String(request.id).includes(text) ||
      request.name?.toLowerCase().includes(text) ||
      request.phone?.includes(text) ||
      request.order_id?.toLowerCase().includes(text) ||
      request.issue_type?.toLowerCase().includes(text) ||
      request.message?.toLowerCase().includes(text)
    );
  });

  if (!adminAccess) {
    return (
      <div className="min-h-screen bg-[#F7FFE7] flex items-center justify-center px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🎧</div>

          <h1 className="text-3xl font-black text-[#0F5132]">
            Support Admin
          </h1>

          <p className="text-gray-600 font-semibold mt-2">
            Enter password to view customer support requests.
          </p>

          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkAdminPassword();
              }
            }}
            placeholder="Enter admin password"
            className="w-full mt-6 border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
          />

          <button
            type="button"
            onClick={checkAdminPassword}
            className="w-full mt-4 bg-[#0F5132] text-white py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
          >
            Open Support Requests
          </button>
        </div>
      </div>
    );
  }

const updateSupportStatus = async (supportId, status) => {
  const confirmStatus = window.confirm(
    `Change support request status to "${status}"?`
  );

  if (!confirmStatus) return;

  try {
    await axios.patch(`${SUPPORT_API_URL}${supportId}/status/`, {
  status: status,
});

    alert(`Support request changed to ${status} ✅`);
    fetchSupportRequests();
  } catch (error) {
    console.log("SUPPORT STATUS ERROR:", error);
    console.log("BACKEND ERROR:", error.response?.data);

    alert(
      error.response?.data
        ? JSON.stringify(error.response.data)
        : "Status update failed"
    );
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
                Support Admin Dashboard
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 font-bold">
            <Link
              to="/admin-orders"
              className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB]"
            >
              Admin Orders
            </Link>

            <Link
              to="/customer-support-admin"
              className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md"
            >
              Support Admin
            </Link>

            <button
              type="button"
              onClick={() => {
                setAdminAccess(false);
                setAdminPassword("");
              }}
              className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="px-4 py-10 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#0F5132] to-[#65A30D] text-white rounded-[2rem] shadow-2xl p-6 md:p-8">
            <p className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm font-black">
              🎧 Customer Support Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-4">
              Support Requests
              <span className="ml-3 text-2xl bg-[#FACC15] text-[#0F5132] px-4 py-1 rounded-full">
                {supportRequests.length}
              </span>
            </h1>

            <p className="mt-3 text-green-50 font-semibold">
              View customer complaints, delivery issues, payment issues, and product quality requests.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search + Refresh */}
          <div className="bg-white rounded-3xl shadow-xl border border-lime-200 p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-[450px]">
              <label className="block text-sm font-black text-[#0F5132] mb-2">
                🔍 Search Requests
              </label>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search name, phone, order id, issue..."
                className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
              />
            </div>

            <button
              type="button"
              onClick={fetchSupportRequests}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg"
            >
              Refresh 🔄
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="text-7xl animate-bounce">⏳</div>
              <h2 className="text-3xl font-black text-[#0F5132] mt-4">
                Loading Support Requests...
              </h2>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="text-7xl">📭</div>
              <h2 className="text-3xl font-black text-gray-700 mt-4">
                No Support Requests Found
              </h2>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-3xl shadow-xl border-l-8 border-[#0F5132] p-5 md:p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-[#FACC15] text-[#0F5132] px-4 py-1 rounded-full font-black">
                          Support #{request.id}
                        </span>

                        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-black">
                          {request.issue_type}
                        </span>

                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-black">
                          {request.status || "New"}
                        </span>
                        <select
  value={request.status || "New"}
  onChange={(e) => updateSupportStatus(request.id, e.target.value)}
  className="bg-white border-2 border-lime-200 text-[#0F5132] px-3 py-1 rounded-full font-black outline-none"
>
  <option value="New">New</option>
  <option value="In Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
</select>
                      </div>

                      <h2 className="text-3xl font-black text-[#0F5132]">
                        {request.name}
                      </h2>

                      <p className="font-bold text-gray-700 mt-2">
                        📞 {request.phone}
                      </p>

                      <p className="font-bold text-gray-700">
                        🧾 Order ID: {request.order_id || "Not added"}
                      </p>

                      <p className="font-bold text-gray-500 mt-1">
                        📅 {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/91${request.phone}?text=${encodeURIComponent(
                        `Hi ${request.name}, we received your support request for ${request.issue_type}. How can we help you?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-fit text-center bg-[#25D366] text-white px-5 py-3 rounded-2xl font-black hover:bg-green-500 shadow-lg"
                    >
                      WhatsApp Reply 💬
                    </a>
                  </div>

                  <div className="mt-5 bg-[#F7FFE7] border border-lime-200 rounded-2xl p-4">
                    <p className="font-black text-[#0F5132] mb-2">
                      Customer Message:
                    </p>

                    <p className="font-bold text-gray-700 whitespace-pre-wrap">
                      {request.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SupportAdmin;