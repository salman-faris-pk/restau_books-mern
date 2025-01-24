import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainLayout ,AuthLayout } from "./layouts/Layouts"
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";



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
      ]
    },


  ]);

  return (
    
    <RouterProvider router={router}/>
  )
}

export default App
