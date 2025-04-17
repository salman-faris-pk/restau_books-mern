import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/Layouts";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Profile from "./pages/Profile";
import { lazy, Suspense } from "react";

const LazyLoad = (Component: React.LazyExoticComponent<() => React.ReactElement>) => (
  <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
    <Component />
  </Suspense>
);

const Homepage = lazy(() => import("./pages/Homepage"));
const Register = lazy(() => import("./pages/Register"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AddHotel = lazy(() => import("./pages/AddHotel"));
const MyHotels = lazy(() => import("./pages/MyHotels"));
const EditHotel = lazy(() => import("./pages/EditHotel"));
const Search = lazy(() => import("./pages/Search"));
const Detail = lazy(() => import("./pages/Detail"));
const Booking = lazy(() => import("./pages/Booking"));
const MyBookings = lazy(() => import("./pages/MyBookings"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: LazyLoad(Homepage) },
      { path: "/search", element: LazyLoad(Search) },
      { path: "/detail/:hotelId", element: LazyLoad(Detail) },
      { path: "/register", element: LazyLoad(Register) },
      { path: "/sign-in", element: LazyLoad(SignIn) },

      // **Protected Routes**
      { path: "/add-hotel", element: <ProtectedRoute element={<AddHotel />} /> },
      { path: "/my-hotels", element: <ProtectedRoute element={<MyHotels />} /> },
      { path: "/edit-hotel/:hotelId", element: <ProtectedRoute element={<EditHotel />} /> },
      { path: "/hotel/:hotelId/booking", element: <ProtectedRoute element={<Booking />} /> },
      { path: "/my-bookings", element: <ProtectedRoute element={<MyBookings />} /> },
      { path: "/profile", element: <ProtectedRoute element={<Profile />} /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;


