import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainLayout } from "./layouts/Layouts"
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";



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



  ]);

  return (
    
    <RouterProvider router={router}/>
  )
}

export default App
