import Profile from "./pages/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Farm from "./pages/Farm";
import TrackOrder from "./pages/TrackOrder";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerService from "./pages/CustomerService";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/farm/:category" element={<Farm />} />
        <Route path="/admin-orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/my-orders" element={<CustomerOrders />} />
        <Route path="/customer-service" element={<CustomerService />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;