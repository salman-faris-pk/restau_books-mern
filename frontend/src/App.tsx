import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainLayout } from "./layouts/Layouts"
import Homepage from "./pages/Homepage";



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
      


      ]
    },



  ]);

  return (
    
    <RouterProvider router={router}/>
  )
}

export default App
