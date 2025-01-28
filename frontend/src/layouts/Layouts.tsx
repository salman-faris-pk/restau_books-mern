import Header from "../components/Header";
import { Navigate, Outlet, useLocation } from "react-router-dom"
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useAppContext } from "../contexts/AppContext";
import SearchBar from "../components/SearchBar";


const MainLayout =( )=>{


    return (
        <div className="flex flex-col min-h-screen">

           <Header />
           <Hero />

           <div className="container mx-auto">
             <SearchBar />
            </div>

            <div className="container mx-auto py-10 flex-1">
               <Outlet />
            </div>
              <Footer />
            
        </div>
    )
}



const AuthLayout =()=>{

  const location=useLocation()

  const { isLoggedIn } = useAppContext();

   if(!isLoggedIn) return <Navigate to={"/sign-in"} state={{ from: location }} replace/>


   
    return (
        <div className="flex flex-col min-h-screen">

           <Header />
           <Hero />

           <div className="container mx-auto">
             <SearchBar />
            </div>

            <div className="container mx-auto py-10 flex-1">
              <Outlet />
            </div>
              <Footer />
            
        </div>
    )
};



export { MainLayout,AuthLayout}