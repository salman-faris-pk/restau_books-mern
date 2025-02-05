// import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import { MainLayout ,AuthLayout } from "./layouts/Layouts"
// import Homepage from "./pages/Homepage";
// import Register from "./pages/Register";
// import SignIn from "./pages/SignIn";
// import AddHotel from "./pages/AddHotel";
// import MyHotels from "./pages/MyHotels";
// import EditHotel from "./pages/EditHotel";
// import Search from "./pages/Search";
// import Detail from "./pages/Detail";
// import Booking from "./pages/Booking";
// import MyBookings from "./pages/MyBookings";



// function App() {

//   const router=createBrowserRouter([

//     {
//       path:"/",
//       element: <MainLayout />,
//       children: [
//         {
//           path:"/",
//           element: <Homepage/>
//         },
//         {
//           path:"/search",
//           element: <Search />
//         },
//         {
//           path:"/detail/:hotelId",
//           element:<Detail />

//         },

//         {
//           path:"/register",
//           element: <Register />
//         },
//         {
//           path:"/sign-in",
//           element: <SignIn />
//         },

//       ]
//     },

//     {
//       path:"/",
//       element: <AuthLayout />,
//       children:[
//         {
//           path:"/add-hotel",
//           element: <AddHotel />
//         },
//         {
//           path:"/my-hotels",
//           element: <MyHotels />
//         },
//         {
//           path:"/edit-hotel/:hotelId",
//           element: <EditHotel />
//         },
//         {
//           path:"/hotel/:hotelId/booking",
//           element: <Booking />
//         },
//         {
//           path:"/my-bookings",
//           element: <MyBookings />
//         },
        
//       ]
//     },


//   ]);

//   return (
    
//     <RouterProvider router={router}/>

//   )
// }

// export default App
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load your components
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
        <Suspense fallback={<div>Loading...</div>}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Homepage />
            </Suspense>
          ),
        },
        {
          path: "/search",
          element: (
            <Suspense fallback={<div>Loading...</div>}
            >
              <Search />
            </Suspense>
          ),
        },
        {
          path: "/detail/:hotelId",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Detail />
            </Suspense>
          ),
        },
        {
          path: "/register",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
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
      path: "/auth",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/auth/add-hotel",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <AddHotel />
            </Suspense>
          ),
        },
        {
          path: "/auth/my-hotels",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <MyHotels />
            </Suspense>
          ),
        },
        {
          path: "/auth/edit-hotel/:hotelId",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <EditHotel />
            </Suspense>
          ),
        },
        {
          path: "/auth/hotel/:hotelId/booking",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Booking />
            </Suspense>
          ),
        },
        {
          path: "/auth/my-bookings",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
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
