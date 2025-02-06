import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import {AuthLayout,MainLayout} from "./layouts/Layouts"
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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<div className="text-gray-200">Loading...</div>}>
              <Homepage />
            </Suspense>
          ),
        },
        {
          path: "/search",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}
            >
              <Search />
            </Suspense>
          ),
        },
        {
          path: "/detail/:hotelId",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <Detail />
            </Suspense>
          ),
        },
        {
          path: "/register",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: "/sign-in",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <SignIn />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          <AuthLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/add-hotel",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <AddHotel />
            </Suspense>
          ),
        },
        {
          path: "/my-hotels",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <MyHotels />
            </Suspense>
          ),
        },
        {
          path: "/edit-hotel/:hotelId",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <EditHotel />
            </Suspense>
          ),
        },
        {
          path: "/hotel/:hotelId/booking",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <Booking />
            </Suspense>
          ),
        },
        {
          path: "/my-bookings",
          element: (
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              <MyBookings />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
