import { Link, useNavigate, useLocation } from "react-router-dom";
import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

function Navbar({ subtitle = "Fresh Farm Products • Fast Delivery" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavbarSearch = (e) => {
    if (e.key !== "Enter") return;

    const value = e.target.value.trim().toLowerCase();

    if (!value) return;

    if (value.includes("fruit")) {
      navigate("/farm/Fruits");
    } else if (value.includes("vegetable") || value.includes("veggie")) {
      navigate("/farm/Vegetables");
    } else if (value.includes("organic")) {
      navigate("/farm/Organic");
    } else if (value.includes("order")) {
      navigate("/orders");
    } else if (value.includes("profile")) {
      navigate("/profile");
    } else if (value.includes("farm")) {
      navigate("/products");
    } else {
      alert("Search not found. Try Fruits, Vegetables, Organic, Orders, or Profile.");
    }

    e.target.value = "";
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[200] bg-white/95 backdrop-blur-md shadow-md border-b border-lime-100">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-5 px-4 md:px-6">
        {/* Left: Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={goldenLeafLogo}
            alt="GoldenLeaf Farms Logo"
            className="w-16 h-12 md:w-20 md:h-14 object-contain"
          />

          <div>
            <h1 className="text-xl md:text-3xl font-black text-[#0F5132] tracking-wide whitespace-nowrap uppercase font-serif">
              GoldenLeaf Farms
            </h1>

            <p className="text-xs md:text-sm text-[#7A5C00] font-bold">
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              onKeyDown={handleNavbarSearch}
              placeholder="Search fruits, farms, orders..."
              className="w-full bg-[#F7FFE7] border-2 border-lime-200 rounded-full py-2.5 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none focus:border-[#0F5132] focus:bg-white shadow-sm"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base font-black shrink-0">
          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "px-4 py-2 rounded-full bg-[#E8FDCB] text-[#0F5132] shadow-sm transition duration-300"
                : "px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] hover:shadow-md transition duration-300"
            }
          >
            Home
          </Link>

          <Link
            to="/products"
            className={
              location.pathname === "/products" ||
              location.pathname.includes("/farm")
                ? "px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md transition duration-300"
                : "px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] hover:shadow-md transition duration-300"
            }
          >
            Farms
          </Link>

          <Link
            to="/orders"
            className={
              location.pathname === "/orders"
                ? "px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md transition duration-300"
                : "px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] hover:shadow-md transition duration-300"
            }
          >
            Orders
          </Link>

          <Link
            to="/profile"
            className={
              location.pathname === "/profile"
                ? "px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md transition duration-300"
                : "px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] hover:shadow-md transition duration-300"
            }
          >
            Profile
          </Link>

          <a
            href="#about"
            className="px-5 py-2.5 rounded-full bg-[#0F5132] text-white hover:bg-[#FACC15] hover:text-[#0F5132] shadow-md transition duration-300"
          >
            About
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;