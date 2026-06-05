import { Link } from "react-router-dom";

import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";
import fruitBg from "../assets/images/fruit-bg.png";
import vegetableBg from "../assets/images/vegetable-bg.png";
import organicBg from "../assets/images/organic-bg.png";

function Products() {
  const categories = [
    {
      name: "Fruits",
      title: "Fresh Fruits Garden",
      desc: "Tree-fresh fruits picked directly from the farm.",
      image: fruitBg,
      emoji: "🍎",
      badge: "Fresh Picks",
      offer: "Seasonal Bestsellers",
      color: "from-yellow-100 via-lime-100 to-green-100",
      button: "Open Fruits Farm",
    },
    {
      name: "Vegetables",
      title: "Vegetable Farm",
      desc: "Garden-fresh vegetables for daily cooking.",
      image: vegetableBg,
      emoji: "🥦",
      badge: "Garden Fresh",
      offer: "Daily Essentials",
      color: "from-lime-100 via-green-100 to-emerald-100",
      button: "Open Vegetable Farm",
    },
    {
      name: "Organic",
      title: "Organic Products",
      desc: "Pure farm products for healthy living.",
      image: organicBg,
      emoji: "🌱",
      badge: "Healthy Choice",
      offer: "Pure & Natural",
      color: "from-emerald-100 via-green-100 to-lime-100",
      button: "Open Organic Farm",
    },
  ];

const mobileProductPositions = {
  Fruits: {
    1: { top: 230, left: 95 },   // Apple
    2: { top: 80, left: -15 },   // Banana
    3: { top: 145, left: 95 },   // Orange
    4: { top: 220, left: -115 }, // Mango
  },

  Vegetables: {
    5: { top: 170, left: 95 },   // Tomato
    6: { top: 270, left: -15 },  // Carrot
    7: { top: 330, left: -115 }, // Potato
    8: { top: 290, left: 115 },  // Onion
  },

  Organic: {
    9: { top: 120, left: -110 }, // Honey
    10: { top: 260, left: -10 }, // Milk
    11: { top: 330, left: -120 },// Eggs
    12: { top: 300, left: 110 }, // Spinach
  },
};  

  return (
    <div className="min-h-screen bg-[#F7FFE7] text-gray-900">
      {/* Navbar */}
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
                Choose Your Farm Category
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
              className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md"
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
          </div>
        </div>
      </div>

      {/* Offer Bar */}
      <div className="mt-20 w-full bg-[#FACC15] text-black text-center py-2 font-extrabold shadow-md">
        <marquee>
          🧺 Select a farm category • 👨‍🌾 Farmer will pick fresh products • 🚚 Fast delivery • 🎉 Free delivery above ₹500
        </marquee>
      </div>

      {/* Hero */}
      <section className="px-4 py-14 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-lg border border-lime-200 font-extrabold text-[#0F5132]">
            <span className="w-2.5 h-2.5 bg-lime-500 rounded-full animate-pulse"></span>
            Live Farm Shopping
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[#0F5132]">
  Choose Your Farm 🌿
</h1>
          <p className="mt-5 text-lg md:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
            Select Fruits, Vegetables, or Organic products and start your live picking experience.
          </p>

         
        </div>
      </section>

      {/* Category Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/farm/${category.name}`}
              className={`group bg-gradient-to-br ${category.color} rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white hover:-translate-y-3 hover:shadow-[0_25px_60px_rgba(15,81,50,0.25)] transition duration-300`}
            >
              <div className="relative h-80 bg-white overflow-hidden flex items-center justify-center p-4">
  <img
    src={category.image}
    alt={category.name}
    className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
  />

                <div className="absolute top-4 left-4 bg-white text-[#0F5132] px-4 py-2 rounded-full font-black shadow-md">
                  {category.badge}
                </div>

                <div className="absolute top-4 right-4 bg-[#FACC15] text-black px-4 py-2 rounded-full font-black shadow-md">
                  {category.emoji}
                </div>
              </div>

              <div className="p-7">
                <p className="text-sm font-black text-lime-700 uppercase tracking-wide">
                  {category.offer}
                </p>

                <h3 className="text-3xl font-black text-[#0F5132] mt-2">
                  {category.title}
                </h3>

                <p className="text-gray-700 font-semibold mt-3 leading-relaxed">
                  {category.desc}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button className="bg-[#0F5132] text-white px-6 py-3 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg group-hover:scale-105 transition">
                    {category.button} →
                  </button>

                  <span className="text-sm font-black text-[#0F5132] bg-white px-3 py-2 rounded-full shadow">
                    Live Picking
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Trust Section */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 border border-lime-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            <div>
              <div className="text-4xl">⚡</div>
              <h3 className="font-black text-[#0F5132] mt-2">Quick</h3>
              <p className="text-sm text-gray-600 font-semibold">30-45 min</p>
            </div>

            <div>
              <div className="text-4xl">👨‍🌾</div>
              <h3 className="font-black text-[#0F5132] mt-2">Live Picking</h3>
              <p className="text-sm text-gray-600 font-semibold">Farm style</p>
            </div>

            <div>
              <div className="text-4xl">🧾</div>
              <h3 className="font-black text-[#0F5132] mt-2">Invoice</h3>
              <p className="text-sm text-gray-600 font-semibold">PDF / Print</p>
            </div>

            <div>
              <div className="text-4xl">⭐</div>
              <h3 className="font-black text-[#0F5132] mt-2">Rated</h3>
              <p className="text-sm text-gray-600 font-semibold">4.9 quality</p>
            </div>
          </div>
        </div>
      </section>

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

export default Products;