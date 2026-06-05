import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import goldenLeafLogo from "../assets/images/goldenleaf-logo.png";

const API_BASE_URL = "https://goldenleaf-backend.onrender.com/api/orders/";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [adminPassword, setAdminPassword] = useState("");
const [adminAccess, setAdminAccess] = useState(() => {
  return localStorage.getItem("goldenleaf_admin_access") === "true";
});
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dashboardFilter, setDashboardFilter] = useState("All");
  const [searchOrder, setSearchOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [openTimelineId, setOpenTimelineId] = useState(null);
  const [openAddressId, setOpenAddressId] = useState(null);
  const [openCustomerId, setOpenCustomerId] = useState(null);
  const [openAllId, setOpenAllId] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});
  const [customerRatings, setCustomerRatings] = useState({});
  const [customerFeedbacks, setCustomerFeedbacks] = useState({});
  const [savedFeedbacks, setSavedFeedbacks] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showCSVOptions, setShowCSVOptions] = useState(false);
  const csvDropdownRef = useRef(null);
 
const checkAdminPassword = () => {
  if (adminPassword === "GoldenL@2026") {
    localStorage.setItem("goldenleaf_admin_access", "true");
    setAdminAccess(true);
  } else {
    alert("Wrong admin password");
  }
};
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
 useEffect(() => {
  fetchOrders(true);

  const interval = setInterval(() => {
    fetchOrders(false);
  }, 10000);

if (!adminAccess) {
  return (
    <div className="min-h-screen bg-[#F7FFE7] flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🔐</div>

        <h1 className="text-3xl font-black text-[#0F5132]">
          Admin Access
        </h1>

        <p className="text-gray-600 font-semibold mt-2">
          Enter password to open Orders Dashboard.
        </p>

        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full mt-6 border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
        />

        <button
          type="button"
          onClick={checkAdminPassword}
          className="w-full mt-4 bg-[#0F5132] text-white py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
        >
          Open Dashboard
        </button>
      </div>
    </div>
  );
}

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      csvDropdownRef.current &&
      !csvDropdownRef.current.contains(event.target)
    ) {
      setShowCSVOptions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
const getOrderAge = (createdAt) => {
  const createdTime = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdTime;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "Just now";
};
const isNewOrder = (createdAt) => {
  const createdTime = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdTime;
  const minutes = Math.floor(diffMs / 60000);

  return minutes <= 10;
};
const isOldOrder = (createdAt) => {
  const createdTime = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdTime;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return days >= 1;
};
const isUrgentOrder = (order) => {
  const createdTime = new Date(order.created_at);
  const now = new Date();
  const diffMs = now - createdTime;
  const minutes = Math.floor(diffMs / 60000);

  return order.status === "Pending" && minutes >= 30;
};
  const parseItems = (itemsData) => {
    try {
      return JSON.parse(itemsData);
    } catch {
      return [];
    }
  };

const fetchOrders = async (showLoader = true) => {
  try {
    if (showLoader) {
      setLoading(true);
    }

    setErrorMessage("");

    const response = await axios.get(API_BASE_URL);
    setOrders(response.data);
    setLastUpdated(new Date().toLocaleTimeString());
  } catch (error) {
    console.log(error);
    setErrorMessage(
      "Backend server is not running. Please start Django server."
    );
  } finally {
    if (showLoader) {
      setLoading(false);
    }
  }
};

  const deleteOrder = async (order) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete Order #${order.id} for ${order.customer_name}?`
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}${order.id}/`);
    fetchOrders();
    setToastType("delete");

    setToastMessage(`Order #${order.id} deleted successfully 🗑️`);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  } catch (error) {
    console.log(error);
    alert("Delete failed");
  }
};

const deleteCancelledOrders = async () => {
  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  );

  if (cancelledOrders.length === 0) {
    alert("No cancelled orders found");
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${cancelledOrders.length} cancelled orders?`
  );

  if (!confirmDelete) return;

  try {
    for (const order of cancelledOrders) {
      await axios.delete(`${API_BASE_URL}${order.id}/`);
    }

    fetchOrders();

setToastMessage("Cancelled orders deleted successfully ✅");

setTimeout(() => {
  setToastMessage("");
}, 3000);
  } catch (error) {
    console.log(error);
    alert("Failed to delete cancelled orders");
  }
};

const deleteDeliveredOrders = async () => {
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  if (deliveredOrders.length === 0) {
    alert("No delivered orders found");
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${deliveredOrders.length} delivered orders?`
  );

  if (!confirmDelete) return;

  try {
    for (const order of deliveredOrders) {
      await axios.delete(`https://goldenleaf-backend.onrender.com${order.id}/`);
    }

    fetchOrders();

setToastMessage("Delivered orders deleted successfully ✅");

setTimeout(() => {
  setToastMessage("");
}, 3000);
  } catch (error) {
    console.log(error);
    alert("Failed to delete delivered orders");
  }
};
const saveCustomerFeedback = async (orderId) => {
  const rating = customerRatings[orderId] || 0;
  const feedback = customerFeedbacks[orderId] || "";

  if (!rating) {
    alert("Please select rating");
    return;
  }

  if (!feedback.trim()) {
    alert("Please write feedback");
    return;
  }

  try {
   await axios.patch(`${API_BASE_URL}${orderId}/feedback/`, {
      customer_rating: rating,
      customer_feedback: feedback,
    });

    fetchOrders(false);

    setToastType("success");
    setToastMessage(`Feedback saved for Order #${orderId} ✅`);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  } catch (error) {
    console.log(error);
    alert("Feedback save failed. Check backend.");
  }
};


 const updateStatus = async (id, status) => {
  const confirmStatus = window.confirm(
    `Are you sure you want to change order status to "${status}"?`
  );

  if (!confirmStatus) return;

  try {
    await axios.patch(`${API_BASE_URL}${id}/status/`, {
      status,
    });

    fetchOrders(false);

    setToastType("success");
    setToastMessage(`Order status changed to ${status} ✅`);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  } catch (error) {
    console.log(error);
    alert("Status update failed");
  }
};

 const downloadInvoice = (order) => {
  const doc = new jsPDF();
  const { itemLines, productsTotal, deliveryFee, tipAmount, finalAmount } =
    getOrderInvoiceDetails(order);

  doc.setFontSize(22);
  doc.text("Fruit Tree Shop Invoice", 20, 20);

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
  doc.text("Items:", 20, 125);

  let y = 137;

  itemLines.forEach((item) => {
    doc.setFontSize(11);
    doc.text(
      `${item.index}. ${item.name} - Rs.${item.price} x ${item.quantity} = Rs.${item.itemTotal}`,
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
  doc.text("Thank you for shopping with Fruit Tree Shop", 20, y + 50);

  doc.save(`invoice_order_${order.id}.pdf`);

  setToastType("success");
  setToastMessage(`Invoice for Order #${order.id} downloaded ✅`);

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};
 const printInvoice = (order) => {
  const { itemLines, productsTotal, deliveryFee, tipAmount, finalAmount } =
    getOrderInvoiceDetails(order);

  const invoiceWindow = window.open("", "_blank");

  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Invoice Order #${order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #111827;
          }

          h1 {
            color: #15803d;
            text-align: center;
          }

          .box {
            border: 2px solid #16a34a;
            padding: 16px;
            border-radius: 12px;
            margin-top: 15px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
          }

          th {
            background-color: #16a34a;
            color: white;
          }

          .summary {
            margin-top: 20px;
            width: 350px;
            margin-left: auto;
            border: 2px solid #16a34a;
            border-radius: 12px;
            padding: 15px;
          }

          .summary p {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            margin: 8px 0;
          }

          .final {
            font-size: 22px !important;
            font-weight: bold;
            color: #15803d;
            border-top: 2px solid #16a34a;
            padding-top: 10px;
          }
        </style>
      </head>

      <body>
        <h1>🌳 Fruit Tree Shop Invoice</h1>

        <div class="box">
          <p><b>Order ID:</b> #${order.id}</p>
          <p><b>Customer:</b> ${order.customer_name}</p>
          <p><b>Phone:</b> ${order.phone_number}</p>
          <p><b>Email:</b> ${order.email || "No email"}</p>
          <p><b>Address:</b> ${order.address}</p>
          <p><b>City:</b> ${order.city} - ${order.pincode}</p>
          <p><b>Payment:</b> ${order.payment_method}</p>
          <p><b>Status:</b> ${order.status}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Item Total</th>
            </tr>
          </thead>

          <tbody>
            ${itemLines
              .map(
                (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>Rs.${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>Rs.${item.itemTotal}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>

        <div class="summary">
          <p><span>Products Total:</span> <b>Rs.${productsTotal}</b></p>
          <p><span>Delivery Fee:</span> <b>Rs.${deliveryFee}</b></p>
          <p><span>Tip:</span> <b>Rs.${tipAmount}</b></p>
          <p class="final"><span>Final Amount:</span> <b>Rs.${finalAmount}</b></p>
        </div>

        <h3 style="text-align:center; margin-top:30px;">
          Thank you for shopping with Fruit Tree Shop 🌳
        </h3>
      </body>
    </html>
  `);

  invoiceWindow.document.close();
  invoiceWindow.print();

  setToastType("success");
  setToastMessage(`Invoice for Order #${order.id} opened for printing 🖨️`);

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};
const getOrderInvoiceDetails = (order) => {
  const items = parseItems(order.items);

  const productsTotal = items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const deliveryFee = Number(order.delivery_fee || 0);
  const tipAmount = Number(order.tip_amount || 0);
  const finalAmount = Number(order.total_price || 0);

  const itemLines = items.map((item, index) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);
    const itemTotal = price * quantity;

    return {
      index: index + 1,
      name: item.name,
      category: item.category || "",
      price,
      quantity,
      itemTotal,
      text: `${index + 1}. ${item.name} - Rs.${price} x ${quantity} = Rs.${itemTotal}`,
    };
  });

  const invoiceText = `Fruit Tree Shop Invoice

Order ID: #${order.id}
Customer: ${order.customer_name}
Phone: ${order.phone_number}
Email: ${order.email || "No email"}
Address: ${order.address}
City: ${order.city} - ${order.pincode}
Payment: ${order.payment_method}
Status: ${order.status}

Items:
${itemLines.map((item) => item.text).join("\n")}

Products Total: Rs.${productsTotal}
Delivery Fee: Rs.${deliveryFee}
Tip: Rs.${tipAmount}

Final Amount: Rs.${finalAmount}

Thank you for shopping with Fruit Tree Shop 🌳`;

  return {
    items,
    itemLines,
    productsTotal,
    deliveryFee,
    tipAmount,
    finalAmount,
    invoiceText,
  };
};
 const copyOrderDetails = (order) => {
  const { invoiceText } = getOrderInvoiceDetails(order);

  navigator.clipboard.writeText(invoiceText);

  setToastType("success");
  setToastMessage(`Order #${order.id} invoice copied ✅`);

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};
const downloadCSVFile = (csvContent, fileName) => {
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

const exportOrdersCSV = () => {
  const headers = [
  "Order ID",
  "Item Name",
  "Category",
  "Price",
  "Quantity",
  "Calculation",
  "Item Total",
    "Products Total",
    "Delivery Fee",
    "Tip Amount",
    "Final Total",
    "Payment Method",
    "Status",
    "Created At",
  ];

  const rows = [];

  orders.forEach((order) => {
  const {
    itemLines,
    productsTotal,
    deliveryFee,
    tipAmount,
    finalAmount,
  } = getOrderInvoiceDetails(order);

  itemLines.forEach((item) => {
    rows.push([
      order.id,
      item.name,
      item.category,
      item.price,
      item.quantity,
      `${item.name} ${item.price} x ${item.quantity} = ${item.itemTotal}`,
      item.itemTotal,
      productsTotal,
      deliveryFee,
      tipAmount,
      finalAmount,
      order.payment_method,
      order.status,
      new Date(order.created_at).toLocaleString(),
    ]);
  });
});

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "orders_report.csv");

  setToastType("success");
  setToastMessage("Orders CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};

const exportCustomerCSV = () => {
  const headers = [
    "Order ID",
    "Customer Name",
    "Phone Number",
    "Email",
    "Address",
    "City",
    "Pincode",
    "Payment Method",
    "Created At",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.customer_name,
    order.phone_number,
    order.email || "No email",
    order.address,
    order.city,
    order.pincode,
    order.payment_method,
    new Date(order.created_at).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "customer_details.csv");

  setToastType("success");
  setToastMessage("Customer Details CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};
  const filteredOrders = orders
  .filter((order) => {
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    const matchesDashboard =
      dashboardFilter === "All" ||
      dashboardFilter === "Avg Order" ||
      (dashboardFilter === "Today" &&
        new Date(order.created_at).toLocaleDateString() ===
          new Date().toLocaleDateString()) ||
      (dashboardFilter === "Revenue" && order.status !== "Cancelled") ||
      (dashboardFilter === "Tips" && Number(order.tip_amount || 0) > 0) ||
      (dashboardFilter === "Delivery" &&
        Number(order.delivery_fee || 0) > 0) ||
      order.status === dashboardFilter;

    const matchesPayment =
      paymentFilter === "All" || order.payment_method === paymentFilter;

    const matchesSearch =
      String(order.id).includes(searchOrder) ||
      order.customer_name.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.phone_number.includes(searchOrder) ||
      (order.email || "").toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.city.toLowerCase().includes(searchOrder.toLowerCase());

    return (
      matchesStatus &&
      matchesDashboard &&
      matchesPayment &&
      matchesSearch
    );
  })
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const hasActiveFilters =
  searchOrder !== "" ||
  statusFilter !== "All" ||
  paymentFilter !== "All" ||
  dashboardFilter !== "All";
const hasOpenDetails =
  openOrderId !== null ||
  openTimelineId !== null ||
  openAddressId !== null ||
  openCustomerId !== null ||
  openAllId !== null;
const todayOrders = orders.filter((order) => {
  const orderDate = new Date(order.created_at).toLocaleDateString();
  const todayDate = new Date().toLocaleDateString();

  return orderDate === todayDate;
});
const exportTodayOrdersCSV = () => {
  const currentTodayOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    return orderDate === todayDate;
  });

  if (currentTodayOrders.length === 0) {
    setToastType("info");
    setToastMessage("No orders found for today ❌");

    setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return;
  }

  const headers = [
    "Order ID",
    "Item Name",
    "Category",
    "Price",
    "Quantity",
    "Calculation",
    "Item Total",
    "Products Total",
    "Delivery Fee",
    "Tip Amount",
    "Final Total",
    "Payment Method",
    "Status",
    "Created At",
  ];

  const rows = [];

 currentTodayOrders.forEach((order) => {
  const {
    itemLines,
    productsTotal,
    deliveryFee,
    tipAmount,
    finalAmount,
  } = getOrderInvoiceDetails(order);

  itemLines.forEach((item) => {
    rows.push([
      order.id,
      item.name,
      item.category,
      item.price,
      item.quantity,
      `${item.name} ${item.price} x ${item.quantity} = ${item.itemTotal}`,
      item.itemTotal,
      productsTotal,
      deliveryFee,
      tipAmount,
      finalAmount,
      order.payment_method,
      order.status,
      new Date(order.created_at).toLocaleString(),
    ]);
  });
});

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "today_orders_report.csv");

  setToastType("success");
  setToastMessage("Today Orders CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};

const exportFilteredOrdersCSV = () => {
  const currentFilteredOrders = orders
    .filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || order.payment_method === paymentFilter;

      const matchesSearch =
        String(order.id).includes(searchOrder) ||
        order.customer_name
          .toLowerCase()
          .includes(searchOrder.toLowerCase()) ||
        order.phone_number.includes(searchOrder) ||
        (order.email || "")
          .toLowerCase()
          .includes(searchOrder.toLowerCase()) ||
        order.city.toLowerCase().includes(searchOrder.toLowerCase());

      return matchesStatus && matchesPayment && matchesSearch;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (currentFilteredOrders.length === 0) {
    setToastType("info");
    setToastMessage("No filtered orders found ❌");

    setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return;
  }

  const headers = [
    "Order ID",
    "Item Name",
    "Category",
    "Price",
    "Quantity",
    "Calculation",
    "Item Total",
    "Products Total",
    "Delivery Fee",
    "Tip Amount",
    "Final Total",
    "Payment Method",
    "Status",
    "Created At",
  ];

  const rows = [];

  currentFilteredOrders.forEach((order) => {
    const items = parseItems(order.items);

    const productsTotal = items.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    items.forEach((item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);
      const itemTotal = price * quantity;

      rows.push([
        order.id,
        item.name,
        item.category || "",
        price,
        quantity,
        `${item.name} ${price} x ${quantity} = ${itemTotal}`,
        itemTotal,
        productsTotal,
        order.delivery_fee || 0,
        order.tip_amount || 0,
        order.total_price,
        order.payment_method,
        order.status,
        new Date(order.created_at).toLocaleString(),
      ]);
    });
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "filtered_orders_report.csv");

  setToastType("success");
  setToastMessage("Filtered Orders CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};

const exportFilteredCustomerCSV = () => {
  const currentFilteredOrders = orders
    .filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || order.payment_method === paymentFilter;

      const matchesSearch =
        String(order.id).includes(searchOrder) ||
        order.customer_name
          .toLowerCase()
          .includes(searchOrder.toLowerCase()) ||
        order.phone_number.includes(searchOrder) ||
        (order.email || "")
          .toLowerCase()
          .includes(searchOrder.toLowerCase()) ||
        order.city.toLowerCase().includes(searchOrder.toLowerCase());

      return matchesStatus && matchesPayment && matchesSearch;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (currentFilteredOrders.length === 0) {
    setToastType("info");
    setToastMessage("No filtered customers found ❌");

    setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return;
  }

  const headers = [
    "Order ID",
    "Customer Name",
    "Phone Number",
    "Email",
    "Address",
    "City",
    "Pincode",
    "Payment Method",
    "Status",
    "Created At",
  ];

  const rows = currentFilteredOrders.map((order) => [
    order.id,
    order.customer_name,
    order.phone_number,
    order.email || "No email",
    order.address,
    order.city,
    order.pincode,
    order.payment_method,
    order.status,
    new Date(order.created_at).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "filtered_customer_details.csv");

  setToastType("success");
  setToastMessage("Filtered Customer Details CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};

const exportSummaryCSV = () => {
  const totalOrders = orders.length;

  const todayOrdersCount = orders.filter((order) => {
    const orderDate = new Date(order.created_at).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    return orderDate === todayDate;
  }).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.total_price || 0), 0);

  const totalDeliveryFees = orders.reduce(
    (total, order) => total + Number(order.delivery_fee || 0),
    0
  );

  const totalTips = orders.reduce(
    (total, order) => total + Number(order.tip_amount || 0),
    0
  );

  const headers = ["Metric", "Value"];

  const rows = [
    ["Total Orders", totalOrders],
    ["Today Orders", todayOrdersCount],
    ["Pending Orders", pendingOrders],
    ["Delivered Orders", deliveredOrders],
    ["Cancelled Orders", cancelledOrders],
    ["Total Revenue", totalRevenue],
    ["Total Delivery Fees", totalDeliveryFees],
    ["Total Tips", totalTips],
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "orders_summary.csv");

  setToastType("success");
  setToastMessage("Orders Summary CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};
const exportCancelledOrdersCSV = () => {
  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  );

  if (cancelledOrders.length === 0) {
    setToastType("info");
    setToastMessage("No cancelled orders found ❌");

    setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return;
  }

  const headers = [
    "Order ID",
    "Customer Name",
    "Phone Number",
    "Email",
    "Payment Method",
    "Final Total",
    "Status",
    "Created At",
  ];

  const rows = cancelledOrders.map((order) => [
    order.id,
    order.customer_name,
    order.phone_number,
    order.email || "No email",
    order.payment_method,
    order.total_price,
    order.status,
    new Date(order.created_at).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "cancelled_orders.csv");

  setToastType("success");
  setToastMessage("Cancelled Orders CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};
const exportDeliveredOrdersCSV = () => {
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  if (deliveredOrders.length === 0) {
    setToastType("info");
    setToastMessage("No delivered orders found ❌");

    setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return;
  }

  const headers = [
    "Order ID",
    "Customer Name",
    "Phone Number",
    "Email",
    "Payment Method",
    "Final Total",
    "Status",
    "Created At",
  ];

  const rows = deliveredOrders.map((order) => [
    order.id,
    order.customer_name,
    order.phone_number,
    order.email || "No email",
    order.payment_method,
    order.total_price,
    order.status,
    new Date(order.created_at).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");

  downloadCSVFile(csvContent, "delivered_orders.csv");

  setToastType("success");
  setToastMessage("Delivered Orders CSV downloaded ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
};


if (!adminAccess) {
  return (
    <div className="min-h-screen bg-[#F7FFE7] flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-lime-200 p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🔐</div>

        <h1 className="text-3xl font-black text-[#0F5132]">
          Admin Access
        </h1>

        <p className="text-gray-600 font-semibold mt-2">
          Enter password to open Orders Dashboard.
        </p>

        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full mt-6 border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
        />

        <button
          type="button"
          onClick={checkAdminPassword}
          className="w-full mt-4 bg-[#0F5132] text-white py-4 rounded-2xl font-black hover:bg-[#0b3f27] shadow-lg"
        >
          Open Dashboard
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#F7FFE7] pt-28 px-4 md:px-8 pb-8">
     {toastMessage && (
  <div
    className={`fixed top-6 left-4 right-4 md:left-auto md:right-6 md:w-auto text-white px-6 py-4 rounded-2xl shadow-2xl z-[999] font-bold flex items-center justify-between gap-4 animate-bounce overflow-hidden ${
      toastType === "delete"
        ? "bg-red-600"
        : toastType === "info"
        ? "bg-blue-600"
        : "bg-green-600"
    }`}
  >
    <span>{toastMessage}</span>

    <button
      onClick={() => setToastMessage("")}
      className="text-white text-2xl leading-none font-bold hover:scale-125 transition"
    >
      ×
    </button>

    <div className="absolute bottom-0 left-0 h-1 bg-white/80 animate-[pulse_1s_infinite] w-full"></div>
  </div>
)}
    {/* Orders Navbar */}
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
          Orders Management Dashboard
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
  to="/admin-orders"
        className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0F5132] shadow-md"
      >
Admin Orders
      </Link>
<button
  type="button"
  onClick={() => {
    localStorage.removeItem("goldenleaf_admin_access");
    setAdminAccess(false);
    setAdminPassword("");
  }}
  className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
>
  Logout
</button>
      <Link
        to="/profile"
        className="px-4 py-2 rounded-full text-[#0F5132] hover:bg-[#E8FDCB] transition"
      >
        Profile
      </Link>
    </div>
  </div>
</div>

      {/* Page Header */}
<div className="bg-gradient-to-br from-[#0F5132] to-[#65A30D] text-white rounded-[2rem] shadow-2xl p-6 md:p-8 mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
    <div>
      <p className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm font-black">
        📦 Live Orders Dashboard
      </p>

      <h2 className="text-4xl md:text-5xl font-black mt-4">
        Order History
        <span className="ml-3 text-2xl bg-[#FACC15] text-[#0F5132] px-4 py-1 rounded-full">
          {orders.length}
        </span>
      </h2>

      <p className="mt-3 text-green-50 font-semibold">
        Manage orders, invoices, customer contact, status updates, and feedback.
      </p>
    </div>

    <Link
      to="/products"
      className="bg-[#FACC15] text-[#0F5132] px-6 py-3 rounded-2xl font-black hover:bg-yellow-300 shadow-xl transition"
    >
      🧺 Back to Farms
    </Link>
    
  </div>
</div>

      {/* Buttons */}
<div className="flex flex-col md:flex-row gap-3 mb-6 flex-wrap">
<div className="relative" ref={csvDropdownRef}>
    <button
    onClick={() => setShowCSVOptions(!showCSVOptions)}
    className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 font-bold"
  >
    Export CSV ⬇️
  </button>

  {showCSVOptions && (
    <div className="absolute top-14 left-0 bg-white rounded-xl shadow-2xl border p-3 z-50 w-64">
      <button
        onClick={() => {
          exportOrdersCSV();
          setShowCSVOptions(false);
        }}
        className="w-full text-left bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 font-bold mb-2"
      >
        Orders CSV 📦
      </button>
<button
  onClick={() => {
    exportTodayOrdersCSV();
    setShowCSVOptions(false);
  }}
  className="w-full text-left bg-orange-100 text-orange-700 px-4 py-3 rounded-lg hover:bg-orange-200 font-bold mb-2"
>
  Today Orders CSV 📅
</button>
<button
  onClick={() => {
    exportFilteredOrdersCSV();
    setShowCSVOptions(false);
  }}
  className="w-full text-left bg-pink-100 text-pink-700 px-4 py-3 rounded-lg hover:bg-pink-200 font-bold mb-2"
>
  Filtered Orders CSV 🔎
</button>
      <button
        onClick={() => {
          exportCustomerCSV();
          setShowCSVOptions(false);
        }}
        className="w-full text-left bg-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 font-bold"
      >
        Customer Details CSV 👤
      </button>
      <button
  onClick={() => {
    exportFilteredCustomerCSV();
    setShowCSVOptions(false);
  }}
  className="w-full text-left bg-cyan-100 text-cyan-700 px-4 py-3 rounded-lg hover:bg-cyan-200 font-bold"
>
  Filtered Customer CSV 👤🔎
</button>
<button
  onClick={() => {
    exportSummaryCSV();
    setShowCSVOptions(false);
  }}
  className="w-full text-left bg-purple-100 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-200 font-bold mt-2"
>
  Summary CSV 📊
</button>
<button
  onClick={() => {
    exportCancelledOrdersCSV();
    setShowCSVOptions(false);
  }}
  className="w-full text-left bg-red-100 text-red-700 px-4 py-3 rounded-lg hover:bg-red-200 font-bold mt-2"
>
  Cancelled Orders CSV ❌
</button>
<button
  onClick={() => {
    exportDeliveredOrdersCSV();
    setShowCSVOptions(false);
  }}
  className="w-full text-left bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 font-bold mt-2"
>
  Delivered Orders CSV ✅
</button>
    </div>
  )}
</div>

  <button
    onClick={async () => {
      setRefreshing(true);
      await fetchOrders(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }}
    disabled={refreshing}
    className={`text-white px-5 py-3 rounded-lg font-bold ${
      refreshing
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {refreshing ? "Refreshing..." : "Refresh Orders 🔄"}
  </button>
  <button
  onClick={() => {
  const confirmReset = window.confirm(
    "Are you sure you want to reset filters and close all details?"
  );

  if (!confirmReset) return;

  setSearchOrder("");
  setStatusFilter("All");
  setPaymentFilter("All");
  setDashboardFilter("All");
  setOpenOrderId(null);
  setOpenTimelineId(null);
  setOpenAddressId(null);
  setOpenCustomerId(null);
  setOpenAllId(null);

  setToastType("success");
  setToastMessage("Page reset successfully ✅");

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
}}
  disabled={!hasActiveFilters && !hasOpenDetails}
  className={`px-5 py-3 rounded-lg font-bold ${
    !hasActiveFilters && !hasOpenDetails
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gray-700 text-white hover:bg-gray-800"
  }`}
>
  Reset Page 🔄
</button>
{hasOpenDetails && (
  <button
    onClick={() => {
      setOpenOrderId(null);
      setOpenTimelineId(null);
      setOpenAddressId(null);
      setOpenCustomerId(null);
      setOpenAllId(null);
    }}
    className="bg-orange-600 text-white px-5 py-3 rounded-lg hover:bg-orange-700 font-bold"
  >
    Collapse All ▲
  </button>
)}
<button
  onClick={() => {
    if (filteredOrders.length === 0) {
      alert("No orders found");
      return;
    }

    const latestOrder = filteredOrders[0];

    setOpenAllId(latestOrder.id);
    setOpenCustomerId(latestOrder.id);
    setOpenAddressId(latestOrder.id);
    setOpenOrderId(latestOrder.id);
    setOpenTimelineId(latestOrder.id);
  }}
  className="bg-pink-600 text-white px-5 py-3 rounded-lg hover:bg-pink-700 font-bold"
>
  Expand Latest Order 🆕
</button>

 {orders.filter((order) => order.status === "Cancelled").length > 0 && (
  <button
    onClick={deleteCancelledOrders}
    className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 font-bold"
  >
    Clear Cancelled Orders 🗑️
  </button>
)}


  {orders.filter((order) => order.status === "Delivered").length > 0 && (
  <button
    onClick={deleteDeliveredOrders}
    className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 font-bold"
  >
    Clear Delivered Orders ✅
  </button>
)}
</div>
      

      {/* Compact Dashboard */}
<div className="mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5">
    <div>
      <h2 className="text-3xl font-black text-[#0F5132]">
        📊 Orders Overview
      </h2>
      <p className="text-gray-600 font-semibold">
        Live order summary and revenue details
      </p>
    </div>

    <div className="bg-white px-4 py-2 rounded-full shadow-md border border-lime-200 font-bold text-[#0F5132]">
      🔄 Last Updated: {lastUpdated || "Loading..."}
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
    {[
      {
        title: "Total",
        icon: "📦",
        value: orders.length,
        color: "text-[#0F5132]",
        bg: "border-green-500",
      },
      {
        title: "Today",
        icon: "📅",
        value: todayOrders.length,
        color: "text-pink-600",
        bg: "border-pink-500",
      },
      {
        title: "Pending",
        icon: "⏳",
        value: orders.filter((order) => order.status === "Pending").length,
        color: "text-yellow-600",
        bg: "border-yellow-500",
      },
      {
        title: "Packed",
        icon: "📦",
        value: orders.filter((order) => order.status === "Packed").length,
        color: "text-blue-600",
        bg: "border-blue-500",
      },
      {
        title: "Delivered",
        icon: "✅",
        value: orders.filter((order) => order.status === "Delivered").length,
        color: "text-green-600",
        bg: "border-green-500",
      },
      {
        title: "Cancelled",
        icon: "❌",
        value: orders.filter((order) => order.status === "Cancelled").length,
        color: "text-red-600",
        bg: "border-red-500",
      },
      {
        title: "Revenue",
        icon: "💰",
        value: `₹${orders
          .filter((order) => order.status !== "Cancelled")
          .reduce((total, order) => total + Number(order.total_price || 0), 0)}`,
        color: "text-purple-700",
        bg: "border-purple-500",
      },
      {
        title: "Tips",
        icon: "🤝",
        value: `₹${orders.reduce(
          (total, order) => total + Number(order.tip_amount || 0),
          0
        )}`,
        color: "text-yellow-700",
        bg: "border-yellow-500",
      },
      {
        title: "Delivery",
        icon: "🚚",
        value: `₹${orders.reduce(
          (total, order) => total + Number(order.delivery_fee || 0),
          0
        )}`,
        color: "text-orange-600",
        bg: "border-orange-500",
      },
      {
        title: "Avg Order",
        icon: "📊",
        value: `₹${
          orders.filter((order) => order.status !== "Cancelled").length > 0
            ? Math.round(
                orders
                  .filter((order) => order.status !== "Cancelled")
                  .reduce(
                    (total, order) => total + Number(order.total_price || 0),
                    0
                  ) /
                  orders.filter((order) => order.status !== "Cancelled").length
              )
            : 0
        }`,
        color: "text-indigo-600",
        bg: "border-indigo-500",
      },
    ].map((card) => (
      <button
  type="button"
  key={card.title}
  onClick={() => {
  if (card.title === "Total") {
    setDashboardFilter("All");
    setStatusFilter("All");
    setPaymentFilter("All");
    setSearchOrder("");
  } else {
    setDashboardFilter(card.title);

    if (
      ["Pending", "Packed", "Delivered", "Cancelled"].includes(card.title)
    ) {
      setStatusFilter(card.title);
    } else {
      setStatusFilter("All");
    }
  }

  setTimeout(() => {
    document.getElementById("orders-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}}
  className={`text-left bg-white rounded-2xl shadow-md border-l-4 ${card.bg} p-4 hover:-translate-y-1 hover:shadow-xl transition duration-300 ${
    dashboardFilter === card.title
      ? "ring-4 ring-[#FACC15] scale-[1.02]"
      : ""
  }`}
>
        <div className="flex items-center justify-between">
          <p className="font-black text-gray-600 text-sm md:text-base">
            {card.icon} {card.title}
          </p>
        </div>

        <p className={`text-3xl md:text-4xl font-black mt-3 ${card.color}`}>
          {card.value}
        </p>
      </button>
    ))}
  </div>
</div>
     {/* Compact Payment Summary */}
<div className="mb-8 bg-white rounded-3xl shadow-xl border border-lime-100 p-5">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 className="text-2xl font-black text-[#0F5132]">
        💳 Payment Summary
      </h2>
      <p className="text-gray-600 font-semibold text-sm">
        Orders grouped by payment method
      </p>
    </div>

    <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
      <button
        onClick={() => setPaymentFilter("Cash on Delivery")}
        className="bg-orange-50 border border-orange-200 px-4 py-3 rounded-2xl text-center hover:bg-orange-100 transition"
      >
        <p className="text-xl font-black text-orange-600">
          {
            orders.filter(
              (order) => order.payment_method === "Cash on Delivery"
            ).length
          }
        </p>
        <p className="text-xs font-black text-orange-700">COD</p>
      </button>

      <button
        onClick={() => setPaymentFilter("UPI")}
        className="bg-green-50 border border-green-200 px-4 py-3 rounded-2xl text-center hover:bg-green-100 transition"
      >
        <p className="text-xl font-black text-green-600">
          {orders.filter((order) => order.payment_method === "UPI").length}
        </p>
        <p className="text-xs font-black text-green-700">UPI</p>
      </button>

      <button
        onClick={() => setPaymentFilter("Card")}
        className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-2xl text-center hover:bg-blue-100 transition"
      >
        <p className="text-xl font-black text-blue-600">
          {orders.filter((order) => order.payment_method === "Card").length}
        </p>
        <p className="text-xs font-black text-blue-700">CARD</p>
      </button>
    </div>
  </div>
</div>

      {/* Search + Filter */}
      <div className="bg-white p-5 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center">
       <div className="w-full md:w-[420px]">
  <label className="block text-sm font-bold text-gray-600 mb-2">
    🔍 Search Orders
  </label>

  <div className="relative">
    <input
      type="text"
      placeholder="Search by order ID, name, phone, email, city..."
      value={searchOrder}
      onChange={(e) => setSearchOrder(e.target.value)}
      className="border-2 border-gray-200 focus:border-green-500 p-4 pr-12 rounded-xl w-full outline-none text-lg"
    />

    {searchOrder && (
      <button
        type="button"
        onClick={() => setSearchOrder("")}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-2xl hover:text-red-700"
      >
        ×
      </button>
    )}
  </div>
</div>

        
        

        <div className="w-full md:w-auto mt-6">
          <button
            onClick={() => {
              setSearchOrder("");
              setStatusFilter("All");
              setPaymentFilter("All");
            }}
            className="bg-red-500 text-white px-6 py-4 rounded-xl hover:bg-red-600 font-bold w-full text-sm font-bold shadow-md"
          >
            Clear Filters ❌
          </button>
        </div>
      </div>
     {/* Compact Filters */}
<div className="bg-white p-5 rounded-3xl shadow-xl border border-lime-100 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-black text-[#0F5132] mb-2">
        🚚 Order Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
      >
        {["All", "Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"].map(
          (status) => (
            <option key={status} value={status}>
              {status}
            </option>
          )
        )}
      </select>
    </div>

    <div>
      <label className="block text-sm font-black text-[#0F5132] mb-2">
        💳 Payment Method
      </label>

      <select
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
        className="w-full border-2 border-lime-200 bg-[#F7FFE7] p-4 rounded-2xl font-bold outline-none focus:border-[#0F5132]"
      >
        {["All", "Cash on Delivery", "UPI", "Card"].map((payment) => (
          <option key={payment} value={payment}>
            {payment === "Cash on Delivery" ? "COD" : payment}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-end">
      <button
        onClick={() => {
          setStatusFilter("All");
          setPaymentFilter("All");
          setSearchOrder("");
        }}
        className="w-full bg-red-500 text-white px-6 py-4 rounded-2xl hover:bg-red-600 font-black shadow-md"
      >
        Clear Filters ❌
      </button>
    </div>
  </div>
</div>
{(statusFilter !== "All" || paymentFilter !== "All") && (
  <div className="bg-white p-4 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
<div>
  <p className="font-bold text-gray-700">
    🔎 Active Filters:
    <span className="ml-2 text-green-700">
      Status: {statusFilter}
    </span>
    <span className="ml-4 text-purple-700">
      Payment: {paymentFilter === "Cash on Delivery" ? "COD" : paymentFilter}
    </span>
  </p>

  <p className="text-sm font-semibold text-gray-500 mt-1">
    Showing {filteredOrders.length} matching orders
  </p>
</div>
    <button
      onClick={() => {
        setStatusFilter("All");
        setPaymentFilter("All");
      }}
      className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600"
    >
      Reset Filters ❌
    </button>
  </div>
)}
     <div className="mb-6 bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      {dashboardFilter !== "All" && (
  <div className="bg-[#FACC15] text-[#0F5132] p-4 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
    <p className="font-black">
      📊 Showing Dashboard Filter: {dashboardFilter}
    </p>

    <button
      onClick={() => {
  setDashboardFilter("All");
  setStatusFilter("All");
  setPaymentFilter("All");
  setSearchOrder("");
}}
      className="bg-[#0F5132] text-white px-4 py-2 rounded-xl font-black hover:bg-[#0b3f27]"
    >
      Show All Orders
    </button>
  </div>
)}
  <p className="text-lg font-bold text-gray-700">
    📋 Showing {filteredOrders.length} of {orders.length} orders
  </p>

  {lastUpdated && (
    <p className="text-sm font-semibold text-gray-500">
      🔄 Last updated: {lastUpdated}
    </p>
  )}
</div>
<h2
  id="orders-list"
  className="text-2xl font-black text-[#0F5132] mb-4 scroll-mt-28"
>
  🧾 All Orders
</h2>
      {errorMessage ? (
        <div className="bg-red-50 border-4 border-red-400 rounded-3xl shadow-2xl p-10 text-center">
          <div className="text-7xl mb-6">⚠️</div>

          <h2 className="text-3xl font-bold text-red-600">
            Connection Error
          </h2>

          <p className="text-gray-700 mt-3 text-lg">{errorMessage}</p>

          <button
            onClick={fetchOrders}
            className="mt-6 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 text-sm font-bold shadow-md"
          >
            Try Again 🔄
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
          <div className="text-7xl mb-6 animate-bounce">⏳</div>

          <h2 className="text-3xl font-bold text-green-700">
            Loading Orders...
          </h2>

          <p className="text-gray-500 mt-3">
            Please wait, fetching latest orders.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border-4 border-dashed border-gray-300">
  <div className="text-8xl mb-6 animate-bounce">📦</div>

  <h2 className="text-4xl font-bold text-gray-700">
    No Orders Found
  </h2>

  <p className="text-gray-500 mt-4 text-lg">
    No orders match your current search or filters.
  </p>

  <button
   onClick={() => {
  setSearchOrder("");
  setStatusFilter("All");
  setPaymentFilter("All");
  setDashboardFilter("All");
}}
    className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700"
  >
    Reset and Show All Orders 🔄
  </button>
</div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order, index) => {
            const items = parseItems(order.items);
            const totalItems = items.reduce(
              (total, item) => total + Number(item.quantity),
              0
            );
            const productsTotal = items.reduce(
  (total, item) =>
    total + Number(item.price || 0) * Number(item.quantity || 0),
  0
);

const orderDeliveryFee = Number(order.delivery_fee || 0);
const orderTipAmount = Number(order.tip_amount || 0);
const orderFinalAmount = Number(order.total_price || 0);

const itemsBreakdownText = items
  .map(
    (item, itemIndex) =>
      `${itemIndex + 1}. ${item.name} - Rs.${item.price} x ${
        item.quantity
      } = Rs.${Number(item.price || 0) * Number(item.quantity || 0)}`
  )
  .join("\n");

const whatsappMessage = `Hi ${order.customer_name},

Your Fruit Tree Shop order #${order.id} details:

Status: ${order.status}
Payment: ${order.payment_method}

Items:
${itemsBreakdownText}

Products Total: Rs.${productsTotal}
Delivery Fee: Rs.${orderDeliveryFee}
Tip: Rs.${orderTipAmount}

Final Amount: Rs.${orderFinalAmount}

Thank you for shopping with Fruit Tree Shop 🌳`;

const emailMessage = `Hi ${order.customer_name},

Your Fruit Tree Shop order #${order.id} details:

Status: ${order.status}
Payment: ${order.payment_method}

Items:
${itemsBreakdownText}

Products Total: Rs.${productsTotal}
Delivery Fee: Rs.${orderDeliveryFee}
Tip: Rs.${orderTipAmount}

Final Amount: Rs.${orderFinalAmount}

Thank you for shopping with Fruit Tree Shop 🌳`;
const activeOrders = orders.filter((order) => order.status !== "Cancelled");

const averageOrderValue =
  activeOrders.length > 0
    ? Math.round(
        activeOrders.reduce(
          (total, order) => total + Number(order.total_price),
          0
        ) / activeOrders.length
      )
    : 0;
            return (
              <div
  key={order.id}
  className={`bg-white p-5 md:p-6 rounded-xl shadow-2xl hover:scale-[1.02] transition duration-300 border-l-[10px] ${
    order.status === "Pending"
      ? "border-yellow-500 hover:shadow-yellow-200"
      : order.status === "Packed"
      ? "border-blue-500 hover:shadow-blue-200"
      : order.status === "Out for Delivery"
      ? "border-orange-500 hover:shadow-orange-200"
      : order.status === "Delivered"
      ? "border-green-500 hover:shadow-green-200"
      : "border-red-500 hover:shadow-red-200"
  }`}
>
               {index === 0 && (
  <div className="inline-block mb-3 bg-green-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-md">
    🆕 Latest Order
  </div>
)}
{isNewOrder(order.created_at) && (
  <div className="inline-block mb-3 ml-2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
    🔥 New
  </div>
)}
{isOldOrder(order.created_at) && (
  <div className="inline-block mb-3 ml-2 bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
    🕰️ Old Order
  </div>
)}
{isUrgentOrder(order) && (
  <div className="inline-block mb-3 ml-2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md animate-pulse">
    ⚠️ Urgent
  </div>
)}
{Number(order.total_price) >= 500 && (
  <div className="inline-block mb-3 ml-2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
    💎 High Value Order
  </div>
)}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                      {order.customer_name.charAt(0).toUpperCase()}
                    </div>

                    <h3 className="text-2xl font-bold">
                      {order.customer_name}
                    </h3>
                  </div>

                 <div className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold">
  {order.status === "Pending"
    ? "⏳"
    : order.status === "Packed"
    ? "📦"
    : order.status === "Out for Delivery"
    ? "🛵"
    : order.status === "Delivered"
    ? "✅"
    : "❌"}{" "}
  Order #{order.id}
</div>
                </div>
<button
  onClick={() => {
    if (openAllId === order.id) {
      setOpenAllId(null);
      setOpenCustomerId(null);
      setOpenAddressId(null);
      setOpenOrderId(null);
      setOpenTimelineId(null);
    } else {
      setOpenAllId(order.id);
      setOpenCustomerId(order.id);
      setOpenAddressId(order.id);
      setOpenOrderId(order.id);
      setOpenTimelineId(order.id);
    }
  }}
  className="mt-4 bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800"
>
  {openAllId === order.id ? "Hide All Details ▲" : "Show All Details ▼"}
</button>

<button
  onClick={() =>
    setOpenCustomerId(openCustomerId === order.id ? null : order.id)
  }
  className="mt-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-200"
>
  {openCustomerId === order.id ? "Hide Customer ▲" : "Show Customer ▼"}
</button>


{openCustomerId === order.id && (
  <div className="bg-green-50 border rounded-xl p-3 mt-3">
    <p>📞 {order.phone_number}</p>

    <p>
      📧 {order.email ? order.email : "No email added"}
      {!order.email && (
        <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
          Missing
        </span>
      )}
    </p>
  </div>
)}
                <button
  onClick={() =>
    setOpenAddressId(openAddressId === order.id ? null : order.id)
  }
  className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200"
>
  {openAddressId === order.id ? "Hide Address ▲" : "Show Address ▼"}
</button>

{openAddressId === order.id && (
  <div className="bg-gray-50 border rounded-xl p-3 mt-3">
    <p>📍 {order.address}</p>
    <p>
      🏙️ {order.city} - {order.pincode}
    </p>
  </div>
)}

                <div className="mt-2 bg-green-50 border border-green-200 p-3 rounded-xl">
  <p className="font-bold text-gray-700">
    🚚 Delivery Fee: Rs.{order.delivery_fee || 0}
  </p>

  <p className="font-bold text-yellow-700 mt-1">
    🤝 Tip: Rs.{order.tip_amount || 0}
  </p>
 {Number(order.tip_amount) > 0 ? (
  <div className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-md">
    🤝 Customer Tipped ₹{order.tip_amount}
  </div>
) : (
  <p className="text-sm text-gray-500 font-semibold mt-2">
    🤝 No tip added
  </p>
)}

  <p className="font-bold text-green-700 mt-1 text-xl">
    💰 Total: Rs.{order.total_price}
  </p>
</div>

                <p className="text-gray-600 mt-1">
                  📅 {new Date(order.created_at).toLocaleDateString()}
                </p>

                <p className="text-gray-600">
                  ⏰ {new Date(order.created_at).toLocaleTimeString()}
                </p>
<p className="text-sm text-gray-500 font-semibold">
  🕒 Placed {getOrderAge(order.created_at)}
</p>
                <p className="font-semibold mt-2">
                  💳 Payment: {order.payment_method}
                </p>
                <div
  className={`inline-block px-4 py-2 rounded-full font-bold mt-2 text-white ${
    order.payment_method === "Cash on Delivery"
      ? "bg-orange-500"
      : "bg-green-600"
  }`}
>
  {order.payment_method === "Cash on Delivery"
    ? "💵 Payment Pending"
    : "✅ Paid"}
</div>

                <p className="font-semibold text-purple-700 mt-1">
                  🧺 Total Items: {totalItems}
                </p>

                <div
                  className={`inline-block px-4 py-2 rounded-full font-bold mt-3 text-white shadow-lg ${
                    order.status === "Pending"
                      ? "bg-yellow-500"
                      : order.status === "Packed"
                      ? "bg-blue-500"
                      : order.status === "Out for Delivery"
                      ? "bg-orange-500"
                      : order.status === "Delivered"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  🚚 {order.status}
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">
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
                <p className="mt-2 text-sm font-semibold text-gray-600">
  {order.status === "Pending"
    ? "⏳ Order received. Waiting for packing."
    : order.status === "Packed"
    ? "📦 Order packed and ready for delivery."
    : order.status === "Out for Delivery"
    ? "🛵 Delivery partner is on the way."
    : order.status === "Delivered"
    ? "✅ Order delivered successfully."
    : "❌ Order has been cancelled."}
</p>
<div className="flex flex-col md:flex-row gap-3 items-start mt-4">
  <button
    onClick={() =>
      setOpenTimelineId(openTimelineId === order.id ? null : order.id)
    }
    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold hover:bg-blue-200"
  >
    {openTimelineId === order.id ? "Hide Timeline ▲" : "Show Timeline ▼"}
  </button>

  <select
  value={order.status}
  onChange={(e) => updateStatus(order.id, e.target.value)}
  disabled={order.status === "Cancelled"}
  className={`border p-2 rounded-lg w-full md:w-auto ${
    order.status === "Cancelled"
      ? "bg-gray-200 cursor-not-allowed text-gray-500"
      : "bg-white"
  }`}
>
  <option>Pending</option>
  <option>Packed</option>
  <option>Out for Delivery</option>
  <option>Delivered</option>
  <option>Cancelled</option>
  
</select>
{order.status === "Cancelled" && (
  <p className="text-sm text-red-500 font-semibold mt-1">
    🔒 Cancelled order is locked
  </p>
)}
</div>

{openTimelineId === order.id && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
    <div
      className={`p-3 rounded-xl text-center font-bold text-sm ${
        ["Pending", "Packed", "Out for Delivery", "Delivered"].includes(
          order.status
        )
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      ⏳ Received
    </div>

    <div
      className={`p-3 rounded-xl text-center font-bold text-sm ${
        ["Packed", "Out for Delivery", "Delivered"].includes(order.status)
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      📦 Packed
    </div>

    <div
      className={`p-3 rounded-xl text-center font-bold text-sm ${
        ["Out for Delivery", "Delivered"].includes(order.status)
          ? "bg-orange-100 text-orange-700"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      🛵 On Way
    </div>

    <div
      className={`p-3 rounded-xl text-center font-bold text-sm ${
        order.status === "Delivered"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      ✅ Delivered
    </div>
  </div>
)}
                <div>
                  <button
                    onClick={() =>
                      setOpenOrderId(
                        openOrderId === order.id ? null : order.id
                      )
                    }
                    className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-200 text-sm font-bold shadow-md"
                  >
                    {openOrderId === order.id
                      ? "Hide Items ▲"
                      : "Show Items ▼"}
                  </button>

                  {openOrderId === order.id && (
                    <div className="bg-gray-100 p-4 mt-4 rounded-xl">
                      <h4 className="font-bold text-lg mb-3">
                        🧺 Ordered Items
                      </h4>

                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm mb-3 border"
                        >
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <div className="text-3xl">{item.emoji}</div>
                            )}

                            <div>
                              <p className="font-bold text-gray-800">
                                {item.emoji} {item.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          <p className="font-bold text-green-700 text-lg">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
<div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
  <label className="block font-bold text-yellow-700 mb-2">
    📝 Admin Note
  </label>

  <textarea
    value={adminNotes[order.id] || ""}
    onChange={(e) =>
      setAdminNotes((prevNotes) => ({
        ...prevNotes,
        [order.id]: e.target.value,
      }))
    }
    placeholder="Add note for this order..."
    className="w-full border p-3 rounded-lg outline-none focus:border-yellow-500"
  />
</div>
{order.status === "Delivered" && (
  <div className="mt-4 bg-pink-50 border-2 border-pink-200 p-4 rounded-xl">
    <h3 className="font-bold text-pink-700 mb-3 text-lg">
      ⭐ Customer Feedback & Rating
    </h3>

    <div className="flex gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() =>
            setCustomerRatings((prev) => ({
              ...prev,
              [order.id]: star,
            }))
          }
          className={`text-3xl transition ${
            (customerRatings[order.id] || order.customer_rating || 0) >= star
              ? "text-yellow-400 scale-110"
              : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>

    <textarea
      value={customerFeedbacks[order.id] ?? order.customer_feedback ?? ""}
      onChange={(e) =>
        setCustomerFeedbacks((prev) => ({
          ...prev,
          [order.id]: e.target.value,
        }))
      }
      placeholder="Write customer feedback..."
      className="w-full border-2 border-pink-200 p-3 rounded-lg outline-none focus:border-pink-500"
    />

    <button
      type="button"
      onClick={() => saveCustomerFeedback(order.id)}
      className="mt-3 bg-pink-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-pink-700 shadow-md"
    >
      Save Feedback ✅
    </button>

    {order.customer_rating && order.customer_feedback && (
      <div className="mt-4 bg-white border border-pink-200 rounded-xl p-3">
        <p className="font-bold text-yellow-500 text-xl">
          {"★".repeat(order.customer_rating)}
          <span className="text-gray-300">
            {"★".repeat(5 - order.customer_rating)}
          </span>
        </p>

        <p className="mt-2 text-gray-700 font-semibold">
          💬 {order.customer_feedback}
        </p>
      </div>
    )}
  </div>
)}

<div className="flex flex-wrap gap-3 mt-5">                  <button
                    onClick={() => downloadInvoice(order)}
className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-bold shadow-md hover:animate-pulse hover:scale-105 transition duration-300 cursor-pointer"                  >
                    Download Invoice
                  </button>

                  <button
                    onClick={() => printInvoice(order)}
className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 text-sm font-bold shadow-md hover:animate-pulse hover:scale-105 transition duration-300 cursor-pointer"                  >
                    Print Invoice 🖨️
                  </button>

                  <a
  href={`https://wa.me/91${order.phone_number}?text=${encodeURIComponent(
  `Hi ${order.customer_name},\n\n${getOrderInvoiceDetails(order).invoiceText}`
)}`}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    setToastType("info");
    setToastMessage(`Opening WhatsApp for Order #${order.id} 💬`);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }}
className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-bold shadow-md hover:animate-pulse hover:scale-105 transition duration-300 cursor-pointer">
  WhatsApp Customer 💬
</a>
                  <a
  href={`tel:${order.phone_number}`}
  onClick={() => {
    setToastType("info");

    setToastMessage(`Calling ${order.customer_name} 📞`);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }}
className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-center text-sm font-bold shadow-md hover:animate-pulse hover:scale-105 transition duration-300 cursor-pointer">
  Call Customer 📞
</a>
                 {order.email && (
  <a
href={`mailto:${order.email}?subject=${encodeURIComponent(
  `Fruit Tree Shop Order #${order.id}`
)}&body=${encodeURIComponent(getOrderInvoiceDetails(order).invoiceText)}`}   onClick={() => {
      setToastMessage(`Opening email for Order #${order.id} 📧`);

      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }}
className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-center text-sm font-bold shadow-md hover:animate-pulse hover:scale-105 transition duration-300 cursor-pointer"  >
    Email Customer 📧
  </a>
)}

                  <button
                    onClick={() => copyOrderDetails(order)}
className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-bold shadow-md hover:animate-pulse hover:scale-105 transition duration-300 cursor-pointer"                  >
                    Copy Details 📋
                  </button>

                  <button
  onClick={() => deleteOrder(order)}
  disabled={index === 0}
  className={`px-4 py-2 rounded-lg text-sm font-bold shadow-md ${
    index === 0
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-red-500 text-white hover:bg-red-600"
  }`}
>
  {index === 0 ? "Latest Order Locked 🔒" : "Delete Order"}
</button>
{index === 0 && (
  <p className="text-sm text-gray-500 font-semibold mt-2">
    🔒 Latest order is protected from accidental deletion
  </p>
)}
<div className="inline-block mb-3 ml-2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
  🌐 Online Order
</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Page Up / Down Buttons */}
<div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-3">
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl font-bold text-2xl hover:bg-green-700 hover:scale-110 transition duration-300"
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
    className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl font-bold text-2xl hover:bg-blue-700 hover:scale-110 transition duration-300"
    title="Go to Bottom"
  >
    ↓
  </button>
</div>
    </div>
  );
}

export default Orders;