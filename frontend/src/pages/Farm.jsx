import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

import pickSound from "../assets/sounds/pick.mp3";
import dropSound from "../assets/sounds/drop.mp3";
import successSound from "../assets/sounds/success.mp3";

import farmerImg from "../assets/images/farmer.png";
import basketImg from "../assets/images/basket.png";
import fruitBg from "../assets/images/fruit-bg.png";
import vegetableBg from "../assets/images/vegetable-bg.png";
import organicBg from "../assets/images/organic-bg.png";
import grassImg from "../assets/images/grass.png";

import appleImg from "../assets/images/apple.png";
import bananaImg from "../assets/images/banana.png";
import orangeImg from "../assets/images/orange.png";
import mangoImg from "../assets/images/mango.png";
import tomatoImg from "../assets/images/tomato.png";
import carrotImg from "../assets/images/carrot.png";
import potatoImg from "../assets/images/potato.png";
import onionImg from "../assets/images/onion.png";
import honeyImg from "../assets/images/honey.png";
import milkImg from "../assets/images/milk.png";
import eggsImg from "../assets/images/eggs.png";
import spinachImg from "../assets/images/spinach.png";

function Farm() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const products = [
    {
      id: 1,
      image: appleImg,
      emoji: "🍎",
      name: "Apple",
      price: 50,
      category: "Fruits",
      top: 150,
      left: 80,
      stock: 10,
    },
    {
      id: 2,
      image: bananaImg,
      emoji: "🍌",
      name: "Banana",
      price: 30,
      category: "Fruits",
      top: 70,
      left: -60,
      stock: 25,
    },
    {
      id: 3,
      image: orangeImg,
      emoji: "🍊",
      name: "Orange",
      price: 40,
      category: "Fruits",
      top: 50,
      left: 80,
      stock: 12,
    },
    {
      id: 4,
      image: mangoImg,
      emoji: "🥭",
      name: "Mango",
      price: 80,
      category: "Fruits",
      top: 130,
      left: -160,
      stock: 15,
    },
    {
      id: 5,
      image: tomatoImg,
      emoji: "🍅",
      name: "Tomato",
      price: 25,
      category: "Vegetables",
      top: 190,
      left: 150,
      stock: 20,
    },
    {
      id: 6,
      image: carrotImg,
      emoji: "🥕",
      name: "Carrot",
      price: 35,
      category: "Vegetables",
      top:280,
      left: -60,
      stock: 18,
    },
    {
      id: 7,
      image: potatoImg,
      emoji: "🥔",
      name: "Potato",
      price: 30,
      category: "Vegetables",
      top: 250,
      left: -300,
      stock: 25,
    },
    {
      id: 8,
      image: onionImg,
      emoji: "🧅",
      name: "Onion",
      price: 40,
      category: "Vegetables",
      top: 290,
      left: 220,
      stock: 22,
    },
    {
      id: 9,
      image: honeyImg,
      emoji: "🍯",
      name: "Honey",
      price: 120,
      category: "Organic",
      top: 100,
      left: -180,
      stock: 10,
    },
    {
      id: 10,
      image: milkImg,
      emoji: "🥛",
      name: "Milk",
      price: 60,
      category: "Organic",
      top: 300,
      left: -30,
      stock: 15,
    },
    {
      id: 11,
      image: eggsImg,
      emoji: "🥚",
      name: "Eggs",
      price: 90,
      category: "Organic",
      top: 200,
      left: -280,
      stock: 12,
    },
    {
      id: 12,
      image: spinachImg,
      emoji: "🥬",
      name: "Spinach",
      price: 35,
      category: "Organic",
      top: 290,
      left: 200,
      stock: 20,
    },
  ];

  const validCategories = ["Fruits", "Vegetables", "Organic"];
  const startCategory = validCategories.includes(category) ? category : "Fruits";

  const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("goldenleaf_cart");
  return savedCart ? JSON.parse(savedCart) : [];
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(startCategory);

  const [highlightProductId, setHighlightProductId] = useState(null);
  const [searchPopup, setSearchPopup] = useState("");

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showDeliveryBike, setShowDeliveryBike] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [tipAmount, setTipAmount] = useState(0);
  const [showFarmerAssistant, setShowFarmerAssistant] = useState(true);

  const [farmerPos, setFarmerPos] = useState({
 left: window.innerWidth < 768 ? 70 : 120,
top: window.innerWidth < 768 ? 455 : 350,
});
  const [farmerMessage, setFarmerMessage] = useState("Ready to pick 👨‍🌾");
  const [assistantMessage, setAssistantMessage] = useState(
    "Welcome to GoldenLeaf Farms 🌿"
  );

  const [isPicking, setIsPicking] = useState(false);
  const [carryingProduct, setCarryingProduct] = useState("");
  const [floatingFruit, setFloatingFruit] = useState("");
  const [basketAnimate, setBasketAnimate] = useState(false);
  const [basketSplash, setBasketSplash] = useState("");
  const [showFloatingCart, setShowFloatingCart] = useState(true);
  const [showFarmButtons, setShowFarmButtons] = useState(true);
  const [formData, setFormData] = useState(() => {
  const savedCustomer = localStorage.getItem("goldenleaf_customer");

  return savedCustomer
    ? JSON.parse(savedCustomer)
    : {
        customer_name: "",
        phone_number: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
        payment_method: "Cash on Delivery",
      };
});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
  localStorage.setItem("goldenleaf_cart", JSON.stringify(cart));
}, [cart]);

  useEffect(() => {
  if (validCategories.includes(category)) {
    setSelectedCategory(category);
    setSearch("");
    setHighlightProductId(null);
    setSearchPopup("");
    setShowFloatingCart(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [category]);
useEffect(() => {
  const productName = searchParams.get("product");

  if (!productName) return;

  const foundProduct = products.find(
    (product) =>
      product.name.toLowerCase() === productName.toLowerCase()
  );

  if (!foundProduct) return;

  setSelectedCategory(foundProduct.category);
  setSearch("");
  setHighlightProductId(foundProduct.id);
  setSearchPopup(`${foundProduct.name} found ✅`);

  setTimeout(() => {
    const productElement = document.getElementById(
      `product-${foundProduct.id}`
    );

    if (productElement) {
      productElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 800);

  setTimeout(() => {
    setHighlightProductId(null);
    setSearchPopup("");
  }, 3500);
}, [searchParams]);

 useEffect(() => {
  const handleScroll = () => {
    setShowFarmerAssistant(window.scrollY < 750);

    const basketSection = document.getElementById("basket-section");

    if (basketSection) {
      const basketTop = basketSection.getBoundingClientRect().top;

      if (basketTop <= 260) {
        setShowFloatingCart(false);
        setShowFarmButtons(false);
      } else {
        setShowFarmButtons(true);
      }
    } else {
      setShowFarmButtons(true);
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [cart.length]);

  const currentFarmBg =
    selectedCategory === "Vegetables"
      ? vegetableBg
      : selectedCategory === "Organic"
      ? organicBg
      : fruitBg;

  const categoryData = {
    Fruits: {
      emoji: "🍎",
      title: "Fresh Fruits Garden",
      shortTitle: "Fruits Farm",
      desc: "Tree-fresh fruits from GoldenLeaf Farms.",
      bgColor: "#BAE6FD",
      glow: "yellow",
    },
    Vegetables: {
      emoji: "🥦",
      title: "Vegetable Farm",
      shortTitle: "Vegetable Farm",
      desc: "Garden-fresh vegetables for daily cooking.",
      bgColor: "#86EFAC",
      glow: "lime",
    },
    Organic: {
      emoji: "🌱",
      title: "Organic Products Farm",
      shortTitle: "Organic Farm",
      desc: "Pure organic products for healthy living.",
      bgColor: "#BBF7D0",
      glow: "emerald",
    },
  };

  const activeFarm = categoryData[selectedCategory];

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.volume = 0.8;

    audio.play().catch((error) => {
      console.log("Sound blocked:", error);
    });
  };

  const getCartQuantity = (productId) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    return item ? item.quantity : 0;
  };

  const getRemainingStock = (product) => {
    return product.stock - getCartQuantity(product.id);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSearchLocate = (value) => {
    setSearch(value);

    const searchText = value.trim().toLowerCase();

    if (!searchText) {
      setHighlightProductId(null);
      setSearchPopup("");
      return;
    }

    const foundProduct = products.find(
      (product) =>
        product.category === selectedCategory &&
        product.name.toLowerCase().includes(searchText)
    );

    if (!foundProduct) {
      setSearchPopup("No product found in this farm ❌");

      setTimeout(() => {
        setSearchPopup("");
      }, 2000);

      return;
    }

    setHighlightProductId(foundProduct.id);
    setSearchPopup(`${foundProduct.name} found ✅`);

    setTimeout(() => {
      const productElement = document.getElementById(
        `product-${foundProduct.id}`
      );

      if (productElement) {
        productElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    setTimeout(() => {
      setHighlightProductId(null);
      setSearchPopup("");
    }, 3000);
  };

  const addToBasket = (product) => {
    setShowFloatingCart(true);
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      const currentQuantity = existingProduct ? existingProduct.quantity : 0;

      if (currentQuantity >= product.stock) {
        alert(`${product.name} stock finished. Only ${product.stock} available.`);
        return prevCart;
      }

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const pickProduct = (product) => {
    if (isPicking) return;

    const remainingStock = getRemainingStock(product);

    if (remainingStock <= 0) {
      alert(`${product.name} stock finished`);
      return;
    }

    setIsPicking(true);
    setFarmerMessage(`Farmer is walking to pick ${product.name} ${product.emoji}`);
    setAssistantMessage(`Fresh ${product.name} coming for you 🧺`);

   const productAreaTop = 120;
const farmerOffsetLeft = 90;
const farmerOffsetTop = 40;
    setFarmerPos({
      left: window.innerWidth / 2 + product.left - farmerOffsetLeft,
      top: productAreaTop + product.top + farmerOffsetTop,
    });

    setTimeout(() => {
      setFarmerMessage(`Farmer is picking ${product.name} ${product.emoji}`);
      setCarryingProduct(product.image);
      setFloatingFruit(product.emoji);
      playSound(pickSound);
    }, 800);

    setTimeout(() => {
      setFarmerMessage(`Farmer is carrying ${product.name} to basket 🧺`);
    setFarmerPos({
  left: Math.min(window.innerWidth - 260, 1000),
  top: 380,
});
    }, 1500);

    setTimeout(() => {
      addToBasket(product);
      setBasketAnimate(true);
      setBasketSplash(`${product.name} added ✨`);

      setTimeout(() => {
        setBasketSplash("");
      }, 1200);

      setTimeout(() => {
        setBasketAnimate(false);
      }, 800);

      playSound(dropSound);
      setFarmerMessage(`${product.name} added to basket successfully ✅`);
      setAssistantMessage(`${product.name} added successfully 🎉`);
      setCarryingProduct("");
      setFloatingFruit("");
    }, 2600);

    setTimeout(() => {
    setFarmerPos({
  left: isMobile ? 70 : 120,
top: isMobile ? 455 : 380,
});
      setIsPicking(false);
    }, 3400);
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          if (item.quantity >= item.stock) {
            alert(`${item.name} stock finished. Only ${item.stock} available.`);
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 && totalPrice < 500 ? 30 : 0;
  const finalTotal = totalPrice + deliveryFee + tipAmount;

  const handleChange = (e) => {
  const updatedFormData = {
    ...formData,
    [e.target.name]: e.target.value,
  };

  setFormData(updatedFormData);
  localStorage.setItem("goldenleaf_customer", JSON.stringify(updatedFormData));
};

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Please add products");
      return;
    }

    if (
      !formData.customer_name ||
      !formData.phone_number ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      alert("Please fill all details");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(formData.phone_number)) {
      alert("Please enter a valid 10 digit phone number");
      return;
    }

    const pincodePattern = /^[0-9]{6}$/;

    if (!pincodePattern.test(formData.pincode)) {
      alert("Please enter a valid 6 digit pincode");
      return;
    }

    const orderData = {
      ...formData,
      items: JSON.stringify(cart),
      total_price: finalTotal,
      delivery_fee: deliveryFee,
      tip_amount: tipAmount,
    };

    try {
      setPlacingOrder(true);

     const response = await axios.post(
  "https://goldenleaf-backend.onrender.com/api/orders/",
  orderData
);

setLatestOrder(response.data);

      setCart([]);
      localStorage.removeItem("goldenleaf_cart");
      setTipAmount(0);
      setFormData((prevData) => ({
  ...prevData,
  payment_method: "Cash on Delivery",
}));
      setShowCheckout(false);
      setOrderSuccess(true);
      setShowDeliveryBike(true);
      setDeliveryStatus("Your order is being packed with love and care 💚");
playSound(successSound);

setTimeout(() => {
  setShowDeliveryBike(false);
  setDeliveryStatus("");
}, 5000);
    } 
    
    catch (error) {
  console.log("ORDER ERROR:", error);
  console.log("BACKEND ERROR:", error.response?.data);

  alert(
    error.response?.data
      ? JSON.stringify(error.response.data)
      : "Order failed. Check backend/CORS/API URL."
  );
}
    
    finally {
      setPlacingOrder(false);
    }
  };

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };
}, []);

  return (
    <div className="min-h-screen bg-[#F7FFE7] overflow-hidden relative">
      {/* Farm Navbar */}
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
                Live Picking Farm
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold">
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

      

     {/* Farm Header */}
<section className="mt-20 bg-gradient-to-br from-[#F7FFE7] via-[#ECFCCB] to-[#D9F99D]">
  {/* Sticky Farm Switch Buttons */}
{showFarmButtons && (
  <div className="fixed top-20 left-0 w-full z-[180] py-3 pointer-events-none">
    <div className="flex justify-center gap-2 flex-wrap px-4 pointer-events-auto">
      <Link
        to="/farm/Fruits"
        className={`px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-black shadow-md transition duration-300 ${
          selectedCategory === "Fruits"
            ? "bg-[#FACC15] text-[#0F5132] scale-105"
            : "bg-white/70 backdrop-blur-md text-[#0F5132] hover:bg-white"
        }`}
      >
        🍎 Fruits
      </Link>

      <Link
        to="/farm/Vegetables"
        className={`px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-black shadow-md transition duration-300 ${
          selectedCategory === "Vegetables"
            ? "bg-[#FACC15] text-[#0F5132] scale-105"
            : "bg-white/70 backdrop-blur-md text-[#0F5132] hover:bg-white"
        }`}
      >
        🥦 Vegetables
      </Link>

      <Link
        to="/farm/Organic"
        className={`px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-black shadow-md transition duration-300 ${
          selectedCategory === "Organic"
            ? "bg-[#FACC15] text-[#0F5132] scale-105"
            : "bg-white/70 backdrop-blur-md text-[#0F5132] hover:bg-white"
        }`}
      >
        🌱 Organic
      </Link>

      <Link
        to="/products"
        className="px-3 py-2 rounded-full text-sm font-black bg-[#0F5132]/90 text-white shadow-md hover:bg-[#0b3f27] transition duration-300"
      >
        🧺 All Farms
      </Link>
    </div>
  </div>
)}
 
</section>

      {/* Farm Stage */}
      <div
        id="shop"
          className="relative h-[720px] md:h-[calc(100vh-160px)] md:min-h-[640px] overflow-hidden bg-no-repeat"
          style={{
          backgroundColor: activeFarm.bgColor,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)), url(${currentFarmBg})`,
         backgroundSize: isMobile ? "125% auto" : "contain",
          backgroundPosition: "center bottom",
          backgroundAttachment: "scroll",
        }}
      >
       
        {/* Sky Effects */}
        <div className="absolute top-16 right-24 w-32 h-32 bg-yellow-300 rounded-full shadow-2xl z-10"></div>

        <div className="absolute top-8 left-12 text-7xl opacity-80 animate-pulse z-20">
          ☁️
        </div>

        <div className="absolute top-16 right-40 text-7xl opacity-80 animate-bounce z-20">
          ☁️
        </div>

        <div className="absolute top-14 left-16 text-4xl animate-pulse z-30">
          🐦 🐦
        </div>

        <div className="absolute top-20 right-60 text-3xl animate-bounce z-30">
          🐦
        </div>

        {/* Grass */}
        <div className="absolute bottom-0 left-0 w-full h-[260px] z-20 pointer-events-none overflow-hidden">
          <img
            src={grassImg}
            alt="Grass Ground"
            className="absolute left-0 w-full h-[420px] object-fill"
            style={{
              bottom: "-150px",
            }}
          />
        </div>

        {/* Product Area */}
<div className="absolute left-1/2 top-[210px] md:top-20 -translate-x-1/2 z-30 scale-[0.82] md:scale-100">
          {filteredProducts.map((product) => {
            const remainingStock = getRemainingStock(product);

            return (
              <div
                id={`product-${product.id}`}
                key={product.id}
                onClick={() => pickProduct(product)}
                className={`absolute transition duration-300 ${
                  remainingStock <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : selectedCategory === "Vegetables"
                    ? "cursor-pointer hover:scale-125 hover:drop-shadow-[0_0_25px_lime]"
                    : selectedCategory === "Organic"
                    ? "cursor-pointer hover:scale-125 hover:drop-shadow-[0_0_25px_emerald]"
                    : "cursor-pointer hover:scale-125 hover:drop-shadow-[0_0_25px_yellow]"
                }`}
                style={{
  top: `${
    isMobile
      ? mobileProductPositions[selectedCategory]?.[product.id]?.top ?? product.top
      : product.top
  }px`,
  left: `${
    isMobile
      ? mobileProductPositions[selectedCategory]?.[product.id]?.left ?? product.left
      : product.left
  }px`,
}}
              >
                <div className="relative">
                  {remainingStock > 0 ? (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-yellow-300/40 animate-ping"></div>

                      <img
                        src={product.image}
                        alt={product.name}
                        className={`relative w-12 h-14 md:w-16 md:h-20 object-contain drop-shadow-2xl transition duration-500 ${
                          highlightProductId === product.id
                            ? "scale-150 animate-bounce ring-4 ring-yellow-400 rounded-full bg-yellow-200/50 p-2"
                            : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold text-sm">
                      Sold Out
                    </div>
                  )}

                 <div className="absolute -bottom-14 md:-bottom-16 left-1/2 -translate-x-1/2 bg-white/95 px-2 py-1 md:py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold shadow-md text-center min-w-[72px] md:min-w-[82px] border border-green-300">
          
  <p className="text-gray-800 leading-tight">
    {product.name}
  </p>

  <p className="text-black leading-tight">
    ₹{product.price}
  </p>

  <p
    className={`text-[10px] leading-tight ${
      remainingStock <= 0 ? "text-red-600" : "text-green-600"
    }`}
  >
    Stock: {remainingStock}
  </p>

  {remainingStock > 0 && (
    <p className="text-[9px] text-blue-600 mt-0.5 leading-tight">
      Pick 👆
    </p>
  )}
</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Farmer */}
        <div
          className="absolute transition-all duration-[900ms] ease-in-out z-40"
          style={{
            left: `${farmerPos.left}px`,
            top: `${farmerPos.top}px`,
          }}
        >
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-green-700 px-4 py-2 rounded-2xl shadow-2xl font-bold text-sm whitespace-nowrap border-2 border-green-400">
            {isPicking ? farmerMessage : "Ready to pick 👨‍🌾"}
          </div>

          <div className="relative">
            <img
              src={farmerImg}
              alt="Farmer"
              className="w-24 md:w-40 animate-bounce drop-shadow-2xl"
            />

            <div className="w-24 h-5 bg-black/30 blur-md rounded-full mx-auto -mt-4"></div>

            {isPicking && (
              <div className="absolute -bottom-4 left-10 text-3xl animate-pulse">
                👣
              </div>
            )}

            {carryingProduct && (
              <img
                src={carryingProduct}
                alt="Carrying"
                className="absolute top-16 -right-4 w-16 h-16 object-contain animate-bounce z-50"
              />
            )}
          </div>
        </div>

        {/* Floating Fruit */}
        {floatingFruit && (
          <div
            className="absolute z-50 animate-bounce"
            style={{
              left: `${farmerPos.left + 80}px`,
              top: `${farmerPos.top + 20}px`,
            }}
          >
            <div className="bg-white/80 rounded-full p-2 shadow-2xl border-4 border-yellow-300">
              <span className="text-5xl">{floatingFruit}</span>
            </div>
          </div>
        )}

        {/* Basket */}
<div className="absolute bottom-[-20px] right-[-6px] md:bottom-0 md:right-24 z-40">
<div className="relative translate-y-10">          <div
              className={`transition duration-500 ${
                basketAnimate ? "scale-125 rotate-6" : ""
              }`}
            >
              <img
                src={basketImg}
                alt="Basket"
               className="w-28 md:w-48 drop-shadow-2xl" 
              />

              <div className="absolute bottom-10 left-8 flex gap-2 flex-wrap w-28">
                {cart.slice(0, 6).map((item) => (
                  <div key={item.id} className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />

                    {item.quantity > 1 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-3 bg-red-500 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
              {cart.length}
            </div>

            {basketSplash && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-green-700 px-4 py-2 rounded-full shadow-2xl font-bold animate-bounce whitespace-nowrap">
                {basketSplash}
              </div>
            )}
          </div>
        </div>
      </div>


     {/* Basket Details */}
{cart.length > 0 && (
  <section
    id="basket-section"
    className="px-4 py-12 bg-[#F7FFE7] scroll-mt-28"
  >
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Basket Items */}
      <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F5132] to-[#65A30D] text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="text-3xl font-black">🧺 Your Basket</h2>
              <p className="text-green-100 font-semibold mt-1">
                All selected products from GoldenLeaf Farms
              </p>
            </div>

            <div className="bg-white/15 px-4 py-2 rounded-full font-black">
              {cart.length} item types •{" "}
              {cart.reduce((total, item) => total + item.quantity, 0)} pieces
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-[#F7FFE7] border border-lime-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain"
                  />
                </div>

                <div>
                  <h3 className="font-black text-2xl text-[#0F5132]">
                    {item.emoji} {item.name}
                  </h3>

                  <p className="text-sm text-gray-600 font-bold">
                    {item.category}
                  </p>

                  <p className="text-lg font-black text-gray-800 mt-1">
                    ₹{item.price} each
                  </p>

                  <p className="text-sm text-green-600 font-bold">
                    Remaining Stock: {item.stock - item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-3">
                <div className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-md border border-lime-100">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-red-500 text-white w-10 h-10 rounded-xl font-black text-xl hover:bg-red-600"
                  >
                    -
                  </button>

                  <span className="font-black text-xl min-w-[30px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    disabled={item.quantity >= item.stock}
                    className={`w-10 h-10 rounded-xl text-white font-black text-xl ${
                      item.quantity >= item.stock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    +
                  </button>
                </div>

                <p className="text-2xl font-black text-[#0F5132]">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Small Floating Cart Bar */}
{cart.length > 0 && showFloatingCart && (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-sm">
    <button
      type="button"
onClick={() => {
  const basketSection = document.getElementById("basket-section");

  if (basketSection) {
    setShowFarmButtons(false);

    basketSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      setShowFloatingCart(false);
    }, 600);
  }
}}
      className="w-full bg-[#0F5132] text-white rounded-2xl shadow-2xl px-4 py-3 hover:bg-[#0b3f27] hover:scale-[1.02] transition duration-300 border-2 border-white"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FACC15] text-[#0F5132] flex items-center justify-center text-2xl shadow-md">
            🧺
          </div>

          <div className="text-left">
            <p className="font-black text-sm">
              {cart.reduce((total, item) => total + item.quantity, 0)} items
            </p>

            <p className="text-[11px] font-bold text-green-100">
              View Basket
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-black text-lg">
            ₹{finalTotal}
          </p>

          <p className="text-[11px] font-bold text-green-100">
            Open →
          </p>
        </div>
      </div>
    </button>
  </div>
)}

      {/* Bill Summary */}
      <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden h-fit lg:sticky lg:top-28">
        <div className="bg-[#FACC15] text-[#0F5132] p-5">
          <h2 className="text-2xl font-black">🧾 Bill Summary</h2>
          <p className="font-bold text-sm mt-1">Review your order total</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-between font-bold text-gray-700">
            <span>Products Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="flex justify-between font-bold text-gray-700">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="flex justify-between font-bold text-gray-700">
            <span>Partner Tip</span>
            <span>₹{tipAmount}</span>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-black text-[#0F5132]">
              Final Total
            </span>

            <span className="text-3xl font-black text-[#0F5132]">
              ₹{finalTotal}
            </span>
          </div>

          {totalPrice >= 500 ? (
            <div className="bg-green-50 border border-green-300 p-3 rounded-2xl">
              <p className="text-green-700 font-black">
                🎉 Free Delivery Applied
              </p>
              <p className="text-sm text-green-600 font-semibold">
                You saved ₹30 delivery fee.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-300 p-3 rounded-2xl">
              <p className="text-orange-600 font-black">
                Add ₹{500 - totalPrice} more for free delivery
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-300 p-3 rounded-2xl">
            <p className="text-blue-700 font-black">
              ⏰ Estimated Delivery: 30 - 45 minutes
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-2xl">
            <p className="font-black text-yellow-700 mb-3">
              🤝 Add Delivery Partner Tip
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 50].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setTipAmount(tip)}
                  className={`px-3 py-2 rounded-xl font-black ${
                    tipAmount === tip
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-yellow-700 border border-yellow-200"
                  }`}
                >
                  ₹{tip}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCheckout(true);

              setTimeout(() => {
                document
                  .getElementById("checkout-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="w-full bg-[#0F5132] text-white py-4 rounded-2xl hover:bg-[#0b3f27] text-xl font-black shadow-xl"
          >
            Proceed To Checkout ✅
          </button>
<Link
  to="/products"
  className="block w-full text-center bg-[#FACC15] text-[#0F5132] py-4 rounded-2xl hover:bg-yellow-300 text-lg font-black shadow-md"
>
  Continue Shopping 🛒
</Link>

          <button
            onClick={() => {
              const confirmClear = window.confirm(
                "Are you sure you want to clear basket?"
              );

              if (!confirmClear) return;

              setCart([]);
              localStorage.removeItem("goldenleaf_cart");
              setTipAmount(0);
              setShowCheckout(false);
            }}
            className="w-full bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600 text-lg font-black shadow-md"
          >
            Clear Basket 🗑️
          </button>
        </div>
      </div>
    </div>
  </section>
)}

      {/* Checkout */}
{showCheckout && (
  <section
    id="checkout-form"
    className="px-4 py-12 bg-gradient-to-b from-[#F7FFE7] to-[#ECFCCB]"
  >
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-4xl md:text-5xl font-black text-[#0F5132]">
          🧾 Secure Checkout
        </h2>

        <p className="text-gray-700 font-semibold mt-2">
          Add delivery details and confirm your GoldenLeaf Farms order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0F5132] to-[#65A30D] text-white p-6">
            <h3 className="text-3xl font-black">Delivery Details</h3>
            <p className="text-green-100 font-semibold mt-1">
              We’ll use these details for delivery and invoice.
            </p>
          </div>
          <button
  type="button"
  onClick={() => {
    const confirmClear = window.confirm(
      "Clear saved customer details?"
    );

    if (!confirmClear) return;

    const emptyData = {
      customer_name: "",
      phone_number: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      payment_method: "Cash on Delivery",
    };

    setFormData(emptyData);
    localStorage.removeItem("goldenleaf_customer");
  }}
  className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-full font-black hover:bg-red-200"
>
  Clear Saved Details
</button>

          <div className="p-5 md:p-6 space-y-6">
            {/* Contact */}
            <div>
              <h4 className="text-xl font-black text-[#0F5132] mb-4">
                👤 Contact Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="Enter full name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="10 digit phone number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-gray-600 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-xl font-black text-[#0F5132] mb-4">
                📍 Delivery Address
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2">
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="House no, street, landmark..."
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-semibold resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-gray-600 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-600 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="6 digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl outline-none focus:border-[#0F5132] font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h4 className="text-xl font-black text-[#0F5132] mb-4">
                💳 Payment Method
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Cash on Delivery", "UPI", "Card"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        payment_method: method,
                      })
                    }
                    className={`p-4 rounded-2xl border-2 text-left font-black transition duration-300 ${
                      formData.payment_method === method
                        ? "bg-[#FACC15] border-yellow-400 text-[#0F5132] shadow-xl scale-[1.02]"
                        : "bg-white border-lime-200 text-gray-700 hover:bg-[#F7FFE7]"
                    }`}
                  >
                    <div className="text-3xl mb-2">
                      {method === "Cash on Delivery"
                        ? "💵"
                        : method === "UPI"
                        ? "📱"
                        : "💳"}
                    </div>

                    <p>
                      {method === "Cash on Delivery" ? "Cash on Delivery" : method}
                    </p>

                    <span className="text-xs font-bold text-gray-500">
                      {method === "Cash on Delivery"
                        ? "Pay when delivered"
                        : method === "UPI"
                        ? "Fast online payment"
                        : "Card payment"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={placeOrder}
                disabled={placingOrder}
                className={`flex-1 text-white py-4 rounded-2xl text-xl font-black shadow-xl transition duration-300 ${
                  placingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0F5132] hover:bg-[#0b3f27] hover:scale-[1.02]"
                }`}
              >
                {placingOrder ? "Placing Order..." : "Place Order ✅"}
              </button>

              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="bg-gray-700 text-white px-6 py-4 rounded-2xl hover:bg-gray-800 font-black shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 overflow-hidden h-fit lg:sticky lg:top-28">
          <div className="bg-[#FACC15] text-[#0F5132] p-5">
            <h3 className="text-2xl font-black">Order Summary</h3>
            <p className="font-bold text-sm mt-1">Final bill preview</p>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-[#F7FFE7] rounded-2xl p-4 border border-lime-200">
              <p className="font-black text-[#0F5132]">
                🧺 {cart.length} item types
              </p>

              <p className="font-bold text-gray-600 mt-1">
                Total pieces:{" "}
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center gap-3 border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain bg-[#F7FFE7] rounded-xl p-1"
                    />

                    <div>
                      <p className="font-black text-sm text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-xs font-bold text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-black text-[#0F5132]">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between font-bold text-gray-700">
                <span>Products Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between font-bold text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between font-bold text-gray-700">
                <span>Partner Tip</span>
                <span>₹{tipAmount}</span>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-xl font-black text-[#0F5132]">
                  To Pay
                </span>

                <span className="text-3xl font-black text-[#0F5132]">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {totalPrice >= 500 ? (
              <div className="bg-green-50 border border-green-300 p-3 rounded-2xl">
                <p className="text-green-700 font-black">
                  🎉 Free delivery applied
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-300 p-3 rounded-2xl">
                <p className="text-orange-600 font-black">
                  Add ₹{500 - totalPrice} more for free delivery
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-300 p-3 rounded-2xl">
              <p className="text-blue-700 font-black text-sm">
                🚚 Delivery in 30 - 45 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)}

      

      {/* Popups */}
      {searchPopup && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 bg-white text-green-700 px-6 py-4 rounded-2xl shadow-2xl z-[250] font-bold border-4 border-green-500 animate-bounce">
          {searchPopup}
        </div>
      )}

     

      {deliveryStatus && (
  <div className="fixed top-28 left-1/2 -translate-x-1/2 bg-white shadow-2xl px-8 py-5 rounded-3xl z-[250] border-2 border-lime-300 text-center w-[90%] max-w-lg">
    <h2 className="text-xl md:text-2xl font-black text-[#0F5132]">
      {deliveryStatus}
    </h2>
  </div>
)}

      {showDeliveryBike && (
        <div className="fixed bottom-10 left-0 z-[120] animate-[bounce_1s_infinite]">
          <div className="text-8xl animate-pulse">🛵📦</div>
        </div>
      )}

     {orderSuccess && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[300] p-4">
    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[460px] overflow-hidden border border-lime-200">
      <div className="bg-gradient-to-r from-[#0F5132] to-[#65A30D] text-white p-7 text-center">
        <div className="w-20 h-20 mx-auto bg-white text-green-600 rounded-full flex items-center justify-center text-5xl shadow-2xl">
          ✅
        </div>

        <h2 className="text-3xl font-black mt-5">
          Order Confirmed!
        </h2>
      </div>

      <div className="p-6 text-center">
        <h3 className="text-xl md:text-2xl font-black text-[#0F5132]">
          Your order is being packed with love and care 💚
        </h3>

        <p className="mt-4 text-gray-600 font-bold">
          Order ID: #{latestOrder?.id || "Placed"}
        </p>

        <button
          type="button"
          onClick={() => setOrderSuccess(false)}
          className="mt-6 w-full bg-[#0F5132] text-white py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
        >
          Continue Shopping 🧺
        </button>
      </div>
    </div>
  </div>
)}

        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="font-black text-blue-700">
            🚚 Estimated delivery: 30 - 45 minutes
          </p>

          <p className="text-sm font-semibold text-blue-600 mt-1">
            Farmer is picking and packing your fresh products.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOrderSuccess(false)}
            className="bg-[#0F5132] text-white py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
          >
            Continue Shopping 🧺
          </button>

          <a
            href="/profile"
            className="text-center bg-[#FACC15] text-[#0F5132] py-4 rounded-2xl font-black hover:bg-yellow-300 shadow-lg"
          >
            View Profile 👤
          </a>
        </div>
      </div>
  
)}

      {/* Page Up / Down */}
      <div className="fixed bottom-2 right-2 z-[120] flex flex-col gap-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#0F5132] text-white w-10 h-10 rounded-full shadow-2xl font-bold text-2xl hover:bg-[#0b3f27] hover:scale-110 transition"
          title="Go to Top"
        >
          ↑
        </button>

        <button
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          className="bg-[#FACC15] text-[#0F5132] w-10 h-10 rounded-full shadow-2xl font-bold text-2xl hover:bg-yellow-300 hover:scale-110 transition"
          title="Go to Bottom"
        >
          ↓
        </button>
      </div>
  
  

export default Farm;