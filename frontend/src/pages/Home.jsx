import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";
import fruitBg from "../assets/images/fresh-fruits-farm.png";
import vegetableBg from "../assets/images/fresh-vegetables-garden.png";
import organicBg from "../assets/images/organic-products-farm.png";

function Home() {
  const navigate = useNavigate();

const handleNavbarSearch = (e) => {
  if (e.key !== "Enter") return;

  const value = e.target.value.trim().toLowerCase();

  if (!value) return;

  const productRoutes = {
    apple: "/farm/Fruits?product=Apple",
    banana: "/farm/Fruits?product=Banana",
    orange: "/farm/Fruits?product=Orange",
    mango: "/farm/Fruits?product=Mango",

    tomato: "/farm/Vegetables?product=Tomato",
    carrot: "/farm/Vegetables?product=Carrot",
    potato: "/farm/Vegetables?product=Potato",
    onion: "/farm/Vegetables?product=Onion",

    honey: "/farm/Organic?product=Honey",
    milk: "/farm/Organic?product=Milk",
    eggs: "/farm/Organic?product=Eggs",
    egg: "/farm/Organic?product=Eggs",
    spinach: "/farm/Organic?product=Spinach",
  };

  if (productRoutes[value]) {
    navigate(productRoutes[value]);
  } else if (value.includes("fruit")) {
    navigate("/farm/Fruits");
  } else if (value.includes("vegetable") || value.includes("veggie")) {
    navigate("/farm/Vegetables");
  } else if (value.includes("organic")) {
    navigate("/farm/Organic");
  } else if (value.includes("order")) {
    navigate("/orders");
  } else if (value.includes("profile")) {
    navigate("/profile");
  } else if (value.includes("farm") || value.includes("product")) {
    navigate("/products");
  } else if (value.includes("about")) {
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    alert("Product not found. Try Apple, Potato, Mango, Tomato, Honey.");
  }

  e.target.value = "";
};
  const [customerReviews, setCustomerReviews] = useState([]);
  const [visitorCount] = useState(1287);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCustomerReviews = async () => {
      try {
        const response = await axios.get("https://goldenleaf-backend.onrender.com");

        const reviews = response.data
          .filter(
            (order) =>
              order.customer_rating &&
              order.customer_feedback &&
              order.status === "Delivered"
          )
          .slice(0, 3);

        setCustomerReviews(reviews);
      } catch (error) {
        console.log("Reviews fetch failed:", error);
      }
    };

    fetchCustomerReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7FFE7] overflow-hidden text-gray-900">
    {/* Home Navbar */}
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
          Fresh Farm Products • Fast Delivery
        </p>
      </div>
    </Link>

    {/* Search Bar */}
    <div className="hidden lg:flex flex-1 max-w-md mx-4">
      <div className="relative w-full">
        <input
          type="text"
          onKeyDown={handleNavbarSearch}
          placeholder="Search apple, vegetables, orders..."
          className="w-full bg-[#F7FFE7] border-2 border-lime-200 rounded-full py-2.5 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none focus:border-[#0F5132] focus:bg-white shadow-sm"
        />

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
          🔍
        </span>
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold">
      <Link
        to="/"
        className="px-4 py-2 rounded-full bg-[#E8FDCB] text-[#0F5132] shadow-md"
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
  className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
>
  My Orders
</Link>

      <Link
        to="/profile"
        className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
      >
        Profile
      </Link>

      <a
        href="#about"
        className="px-4 py-2 rounded-full bg-[#0F5132] text-white hover:bg-[#FACC15] hover:text-[#0F5132] transition shadow-md"
      >
        About
      </a>
    </div>
  </div>

  {/* Mobile Search Bar */}
  <div className="lg:hidden px-4 pb-3 bg-white">
    <div className="relative w-full">
      <input
        type="text"
        onKeyDown={handleNavbarSearch}
        placeholder="Search apple, vegetables, orders..."
        className="w-full bg-[#F7FFE7] border-2 border-lime-200 rounded-full py-2.5 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none focus:border-[#0F5132] focus:bg-white shadow-sm"
      />

      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
        🔍
      </span>
    </div>
  </div>
</div>
      {/* Offer Banner */}
<div className="mt-28 lg:mt-20 w-full bg-[#FACC15] text-black text-center py-2 font-extrabold shadow-md">        <marquee>
          ⚡ 10-Min Fresh Farm Delivery • 🧺 Live Farmer Picking • 🎉 Free Delivery Above ₹500 • 🌿 Organic Quality • ⭐ 4.9 Customer Rating
        </marquee>
      </div>

      {/* Hero */}
      <section className="relative px-4 pt-12 pb-20 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 min-h-[72vh]">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-lime-200 font-extrabold text-[#0F5132]">
              <span className="w-2.5 h-2.5 bg-lime-500 rounded-full animate-pulse"></span>
              Live Farm Store
            </div>

            <h1 className="mt-6 text-5xl md:text-7xl font-black text-[#0F5132] leading-tight">
              Fresh Groceries
              <span className="block text-[#65A30D]">From Farm 🌿</span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-700 font-semibold max-w-2xl">
              Pick fruits, vegetables, and organic products with a live farm
              picking experience.
            </p>

            <div className="flex justify-center md:justify-start gap-4 flex-wrap mt-7">
              <span className="bg-white text-[#0F5132] px-5 py-2 rounded-full font-bold shadow-md border border-lime-300">
                ✅ Farm Fresh
              </span>

              <span className="bg-white text-blue-700 px-5 py-2 rounded-full font-bold shadow-md border border-blue-200">
                🚚 Fast Delivery
              </span>

              <span className="bg-white text-yellow-700 px-5 py-2 rounded-full font-bold shadow-md border border-yellow-300">
                ⚡ Quick Checkout
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-9">
              <Link
                to="/products"
                className="bg-[#0F5132] text-white px-9 py-4 rounded-2xl text-xl font-black hover:bg-[#0b3f27] shadow-2xl hover:scale-105 transition"
              >
                Start Picking 🧺
              </Link>

              <Link
                to="/orders"
                className="bg-white text-[#0F5132] px-9 py-4 rounded-2xl text-xl font-black hover:bg-[#FACC15] shadow-2xl hover:scale-105 transition border border-lime-200"
              >
                Track Orders 📦
              </Link>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative">
            <div className="bg-white rounded-[2rem] shadow-2xl p-6 border-4 border-white">
              <div className="bg-gradient-to-br from-[#FACC15] to-[#84CC16] rounded-[1.5rem] p-8 text-center">
                <div className="text-8xl">🧺</div>

                <h2 className="text-4xl font-black text-[#0F5132] mt-4">
                  Today’s Fresh Picks
                </h2>

                <p className="mt-3 text-lg font-bold text-green-900">
                  Fruits • Vegetables • Organic Products
                </p>
<div className="grid grid-cols-3 gap-3 mt-6">
  <Link
    to="/farm/Fruits"
    className="bg-white rounded-2xl p-3 shadow-md hover:scale-105 transition"
  >
    <img
      src={fruitBg}
      alt="Fruits"
      className="w-full h-24 object-cover rounded-xl"
    />
    <p className="font-black text-sm mt-2 text-[#0F5132]">Fruits</p>
  </Link>

  <Link
    to="/farm/Vegetables"
    className="bg-white rounded-2xl p-3 shadow-md hover:scale-105 transition"
  >
    <img
      src={vegetableBg}
      alt="Vegetables"
      className="w-full h-24 object-cover rounded-xl"
    />
    <p className="font-black text-sm mt-2 text-[#0F5132]">Veggies</p>
  </Link>

  <Link
    to="/farm/Organic"
    className="bg-white rounded-2xl p-3 shadow-md hover:scale-105 transition"
  >
    <img
      src={organicBg}
      alt="Organic"
      className="w-full h-24 object-cover rounded-xl"
    />
    <p className="font-black text-sm mt-2 text-[#0F5132]">Organic</p>
  </Link>
</div>
              </div>
            </div>

            <div className="absolute -top-5 -right-3 bg-[#FACC15] text-black px-5 py-3 rounded-2xl shadow-xl font-black rotate-3">
              4.9 ⭐ Rated
            </div>

            <div className="absolute -bottom-5 -left-3 bg-[#0F5132] text-white px-5 py-3 rounded-2xl shadow-xl font-black -rotate-3">
              Fresh in Minutes ⚡
            </div>
          </div>
        </div>
      </section>

{/* Quick Category Preview */}
<section className="px-4 pb-8 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D]">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Fruits */}
    <Link
      to="/farm/Fruits"
      className="group bg-white rounded-3xl shadow-xl border border-lime-200 hover:shadow-2xl hover:-translate-y-2 transition duration-300 p-6 flex items-center justify-between gap-5 min-h-[190px]"
    >
      <div className="flex-1">
        <p className="text-sm font-black text-lime-600 uppercase">
          Fresh Picks
        </p>

        <h3 className="text-3xl font-black text-[#0F5132] mt-1">
          Fruits
        </h3>

        <p className="text-gray-600 font-semibold mt-2">
          Tree-fresh seasonal fruits
        </p>

        <span className="inline-block mt-4 bg-[#FACC15] text-[#0F5132] px-5 py-2 rounded-full font-black shadow">
          Open →
        </span>
      </div>

      <div className="w-28 h-28 bg-[#F7FFE7] rounded-3xl flex items-center justify-center p-3 shadow-inner">
        <img
          src={fruitBg}
          alt="Fresh Fruits"
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-500"
        />
      </div>
    </Link>

    {/* Vegetables */}
    <Link
      to="/farm/Vegetables"
      className="group bg-white rounded-3xl shadow-xl border border-lime-200 hover:shadow-2xl hover:-translate-y-2 transition duration-300 p-6 flex items-center justify-between gap-5 min-h-[190px]"
    >
      <div className="flex-1">
        <p className="text-sm font-black text-lime-600 uppercase">
          Garden Fresh
        </p>

        <h3 className="text-3xl font-black text-[#0F5132] mt-1">
          Vegetables
        </h3>

        <p className="text-gray-600 font-semibold mt-2">
          Picked fresh from garden
        </p>

        <span className="inline-block mt-4 bg-[#FACC15] text-[#0F5132] px-5 py-2 rounded-full font-black shadow">
          Open →
        </span>
      </div>

      <div className="w-28 h-28 bg-[#F7FFE7] rounded-3xl flex items-center justify-center p-3 shadow-inner">
        <img
          src={vegetableBg}
          alt="Fresh Vegetables"
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-500"
        />
      </div>
    </Link>

    {/* Organic */}
    <Link
      to="/farm/Organic"
      className="group bg-white rounded-3xl shadow-xl border border-lime-200 hover:shadow-2xl hover:-translate-y-2 transition duration-300 p-6 flex items-center justify-between gap-5 min-h-[190px]"
    >
      <div className="flex-1">
        <p className="text-sm font-black text-lime-600 uppercase">
          Healthy Choice
        </p>

        <h3 className="text-3xl font-black text-[#0F5132] mt-1">
          Organic
        </h3>

        <p className="text-gray-600 font-semibold mt-2">
          Pure farm products
        </p>

        <span className="inline-block mt-4 bg-[#FACC15] text-[#0F5132] px-5 py-2 rounded-full font-black shadow">
          Open →
        </span>
      </div>

      <div className="w-28 h-28 bg-[#F7FFE7] rounded-3xl flex items-center justify-center p-3 shadow-inner">
        <img
          src={organicBg}
          alt="Organic Products"
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-500"
        />
      </div>
    </Link>
  </div>
</section>
     {/* Live Stats */}
<section className="px-4 py-10 bg-[#F7FFE7]">
  <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-4xl font-black text-[#0F5132]">
          👥 1287+
        </h3>
        <p className="font-bold text-gray-600 mt-1">
          Customers Live
        </p>
      </div>

      <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-lime-200 py-5 md:py-0">
        <h3 className="text-4xl font-black text-[#0F5132]">
          30-45 min
        </h3>
        <p className="font-bold text-gray-600 mt-1">
          Estimated Delivery
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h3 className="text-4xl font-black text-[#0F5132]">
          ₹500+
        </h3>
        <p className="font-bold text-gray-600 mt-1">
          Free Delivery
        </p>
      </div>
    </div>
  </div>
</section>

{/* Trust Strip */}
<section className="px-4 py-10 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-[#F7FFE7] rounded-2xl p-5 text-center shadow-md border border-lime-200">
      <div className="text-4xl">⚡</div>
      <h3 className="font-black text-[#0F5132] mt-2">Quick Delivery</h3>
      <p className="text-sm text-gray-600 font-semibold">30-45 min</p>
    </div>

    <div className="bg-[#F7FFE7] rounded-2xl p-5 text-center shadow-md border border-lime-200">
      <div className="text-4xl">🧺</div>
      <h3 className="font-black text-[#0F5132] mt-2">Live Picking</h3>
      <p className="text-sm text-gray-600 font-semibold">Farm experience</p>
    </div>

    <div className="bg-[#F7FFE7] rounded-2xl p-5 text-center shadow-md border border-lime-200">
      <div className="text-4xl">✅</div>
      <h3 className="font-black text-[#0F5132] mt-2">Quality Checked</h3>
      <p className="text-sm text-gray-600 font-semibold">Fresh products</p>
    </div>

    <div className="bg-[#F7FFE7] rounded-2xl p-5 text-center shadow-md border border-lime-200">
      <div className="text-4xl">⭐</div>
      <h3 className="font-black text-[#0F5132] mt-2">Top Rated</h3>
      <p className="text-sm text-gray-600 font-semibold">4.9 customer rating</p>
    </div>
  </div>
</section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-[#F7FFE7]">
        <h2 className="text-4xl md:text-5xl font-black text-center text-[#0F5132]">
          How It Works
        </h2>

        <p className="text-center mt-4 text-gray-700 font-semibold text-lg">
          Simple, fresh, and fast farm shopping.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-b-8 border-lime-500">
            <div className="text-7xl">🌿</div>
            <h3 className="text-2xl font-black text-[#0F5132] mt-4">
              Select Farm
            </h3>
            <p className="mt-3 text-gray-600 font-semibold">
              Choose Fruits, Vegetables, or Organic products.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-b-8 border-yellow-400">
            <div className="text-7xl">👨‍🌾</div>
            <h3 className="text-2xl font-black text-[#0F5132] mt-4">
              Live Picking
            </h3>
            <p className="mt-3 text-gray-600 font-semibold">
              Farmer picks your selected product fresh from the farm.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-b-8 border-green-700">
            <div className="text-7xl">🚚</div>
            <h3 className="text-2xl font-black text-[#0F5132] mt-4">
              Fast Delivery
            </h3>
            <p className="mt-3 text-gray-600 font-semibold">
              Checkout, invoice, WhatsApp updates, and order tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-20 bg-white">
        <h2 className="text-4xl md:text-5xl font-black text-center text-[#0F5132]">
          Customer Ratings ⭐
        </h2>

        <p className="text-center mt-4 text-gray-700 font-semibold text-lg">
          Real feedback from delivered orders.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          {customerReviews.length > 0 ? (
            customerReviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#F7FFE7] p-8 rounded-3xl shadow-xl hover:scale-105 transition border border-lime-200"
              >
                <div className="text-6xl text-center">👤</div>

                <h3 className="text-2xl font-black text-center mt-4 text-[#0F5132]">
                  {review.customer_name}
                </h3>

                <p className="text-center text-yellow-500 text-3xl mt-2">
                  {"⭐".repeat(review.customer_rating)}
                </p>

                <p className="text-center mt-4 text-gray-700 text-lg font-semibold">
                  {review.customer_feedback}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-[#F7FFE7] p-8 rounded-3xl shadow-xl text-center md:col-span-3 border border-lime-200">
              <div className="text-6xl">⭐</div>

              <h3 className="text-2xl font-black mt-4 text-[#0F5132]">
                No reviews yet
              </h3>

              <p className="mt-3 text-gray-600">
                Delivered order feedback will appear here.
              </p>
            </div>
          )}
        </div>
      </section>


      {/* Footer */}
      <footer
  id="about"
  className="bg-[#0F5132] text-white py-10 px-6 text-center"
>
        <h2 className="text-3xl font-black">🌿 GoldenLeaf Farms</h2>

        <p className="mt-3 text-green-100">
          Fresh fruits, vegetables, and organic products picked directly from farm.
        </p>

        <div className="flex justify-center gap-6 mt-6 flex-wrap font-semibold">
          <Link to="/products" className="hover:text-yellow-300">
            Farms
          </Link>

          <Link to="/orders" className="hover:text-yellow-300">
            Orders
          </Link>

          <span>Fast Delivery 🚚</span>
          <span>Organic Quality 🌱</span>
        </div>

        <div className="mt-10 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-green-300/30 flex items-center justify-center text-4xl shadow-xl mb-3">
              👨‍💻
            </div>

            <p className="text-sm text-green-200 font-semibold tracking-wide">
              Designed & Developed by
            </p>

            <h3 className="text-3xl md:text-4xl font-black text-white tracking-[0.12em] mt-2 uppercase font-serif drop-shadow-lg">
              Prasanth Kalluri
            </h3>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 bg-[#FACC15] text-[#0F5132] px-4 py-2 rounded-full text-sm font-black shadow-md">
              <span className="w-2 h-2 bg-green-700 rounded-full"></span>
              Full Stack Developer
            </span>

            <a
              href="mailto:prasanthkalluriprojects2026@gmail.com"
              className="inline-flex items-center gap-2 bg-white/10 text-green-100 px-4 py-2 rounded-full text-sm font-bold border border-green-300/30 hover:bg-white/20 transition"
            >
              📧 prasanthkalluriprojects2026@gmail.com
            </a>
          </div>

          <p className="mt-6 text-sm text-green-200">
            © 2026 GoldenLeaf Farms. All rights reserved.
          </p>
          <Link
  to="/admin-orders"
  className="inline-block mt-4 text-xs text-green-300 hover:text-yellow-300 font-bold"
>
  Admin Access
</Link>
        </div>
      </footer>

      {/* Page Up Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-[120] bg-[#0F5132] text-white w-14 h-14 rounded-full shadow-2xl font-bold text-2xl hover:bg-[#0b3f27] hover:scale-110 transition"
      >
        ↑
      </button>
    </div>
  );
}

export default Home;