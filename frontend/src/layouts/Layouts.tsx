import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import MobNav from "../components/MobNav";
import UpArrow from "../components/UpArrow";
import { ScrollToTop } from "../utils/ScrollToTop";

const protectedRoutes = [
  "/add-hotel",
  "/my-hotels",
  "/edit-hotel/",
  "/hotel/",
  "/my-bookings",
  "/profile",
];

const MainLayout = () => {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

  const isProtected = useMemo(
    () => protectedRoutes.some((route) => location.pathname.startsWith(route)),
    [location.pathname]
  );

  if (!isLoggedIn && isProtected) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <MobNav />
      <Header />
      <Hero />

      <div className={`container mx-auto ${["/", "/search"].includes(location.pathname) ? "block" : "hidden"}`}>
        <SearchBar />
      </div>

      <main className="container mx-auto py-10 flex-1">
        <Outlet />
      </main>

      <UpArrow />
      <Footer />
    </div>
  );
};

export default MainLayout;
