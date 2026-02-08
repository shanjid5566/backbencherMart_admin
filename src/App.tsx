import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import Layout from "./components/layout/Layout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductsList from "./pages/Products/ProductsList";
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetails from "./pages/Orders/OrderDetails";
import UsersList from "./pages/Users/UsersList";
import ReviewsList from "./pages/Reviews/ReviewsList";
import ReviewDetails from "./pages/Reviews/ReviewDetails";
import Analytics from "./pages/Analytics/Analytics";
import FAQsList from "./pages/FAQs/FAQsList";
import FAQDetails from "./pages/FAQs/FAQDetails";

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Apply dark mode class to html element
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/reviews" element={<ReviewsList />} />
        <Route path="/reviews/:productId" element={<ReviewDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/faqs" element={<FAQsList />} />
        <Route path="/faqs/:productId" element={<FAQDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
