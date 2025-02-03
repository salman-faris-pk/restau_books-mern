import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainLayout ,AuthLayout } from "./layouts/Layouts"
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";



function App() {

  const router=createBrowserRouter([

    {
      path:"/",
      element: <MainLayout />,
      children: [
        {
          path:"/",
          element: <Homepage/>
        },
        {
          path:"/search",
          element: <Search />
        },
        {
          path:"/detail/:hotelId",
          element:<Detail />

        },

        {
          path:"/register",
          element: <Register />
        },
        {
          path:"/sign-in",
          element: <SignIn />
        },

      ]
    },

    {
      path:"/",
      element: <AuthLayout />,
      children:[
        {
          path:"/add-hotel",
          element: <AddHotel />
        },
        {
          path:"/my-hotels",
          element: <MyHotels />
        },
        {
          path:"/edit-hotel/:hotelId",
          element: <EditHotel />
        },{
          path:"/hotel/:hotelId/booking",
          element: <Booking />
        },
        
      ]
    },


  ]);

  return (
    
    <RouterProvider router={router}/>

  )
}

export default App
