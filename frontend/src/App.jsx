import { useState, useEffect } from "react";
import GlobalStyles from "./components/GlobalStyles";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import HomePage from "./pages/HomePage";
import FlightsPage from "./pages/FlightsPage";
import HotelsPage from "./pages/HotelsPage";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import WishlistPage from "./pages/WishlistPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import { useToast } from "./hooks/useToast";
import { useAuth } from "./hooks/useAuth";
import { useWishlist } from "./hooks/useWishlist";
import { destinationsAPI } from "./utils/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [allDestinations, setAllDestinations] = useState([]);

  const { toasts, show: showToast } = useToast();
  const { user, login, register, logout } = useAuth();
  const { wishlist, toggleWishlist, syncWishlist } = useWishlist(user, showToast);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Whenever an admin user is present, lock them to the admin page only
  useEffect(() => {
    if (user?.role === "admin" && page !== "admin") {
      setPage("admin");
    }
  }, [user, page]);

  useEffect(() => { syncWishlist(); }, [syncWishlist]);

  useEffect(() => {
    destinationsAPI.getAll().then(r => setAllDestinations(r.data.data)).catch(() => {});
  }, []);

  // Custom setPage that blocks admins from navigating away from admin
  const safeSetPage = (target) => {
    if (user?.role === "admin" && target !== "admin") return;
    setPage(target);
  };

  const pageProps = { theme, showToast, setPage: safeSetPage, user };

  const renderPage = () => {
    // Admin always sees admin page
    if (user?.role === "admin") {
      return <AdminPage {...pageProps} logout={logout} />;
    }
    switch (page) {
      case "home":      return <HomePage wishlist={wishlist} toggleWishlist={toggleWishlist} {...pageProps} />;
      case "flights":   return <FlightsPage {...pageProps} />;
      case "hotels":    return <HotelsPage {...pageProps} />;
      case "map":       return <MapPage theme={theme} />;
      case "dashboard": return <DashboardPage {...pageProps} />;
      case "wishlist":  return <WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} destinations={allDestinations} {...pageProps} />;
      case "auth":      return <AuthPage login={login} register={register} {...pageProps} />;
      default:          return <HomePage wishlist={wishlist} toggleWishlist={toggleWishlist} {...pageProps} />;
    }
  };

  const isAdminSession = user?.role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: theme === "dark" ? "#050a14" : "#f8fafc" }}>
      <GlobalStyles />
      <Navbar
        page={page}
        setPage={safeSetPage}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        logout={logout}
        wishlistCount={wishlist.length}
      />
      <main>{renderPage()}</main>
      {/* Hide footer for auth page and all admin sessions */}
      {page !== "auth" && !isAdminSession && <Footer theme={theme} />}
      <ToastContainer toasts={toasts} />
    </div>
  );
}