import Header from "../components/Header";
import { Navigate, Outlet, useLocation } from "react-router-dom"
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useAppContext } from "../contexts/AppContext";
import SearchBar from "../components/SearchBar";
import { ScrollToTop } from "../utils/ScrollToTop";


const MainLayout =( )=>{

  const location=useLocation()
  const hiddenPaths = ["/sign-in", "/register", "/detail/:hotelId"];
  const isHidden = hiddenPaths.includes(location.pathname);
    return (
        <div className="flex flex-col min-h-screen">

           <Header />
           <Hero />

           <div className={`${isHidden ? "hidden" : "block"} container mx-auto`}>
             <SearchBar />
            </div>

            <div className="container mx-auto py-10 flex-1">
               <ScrollToTop />
               <Outlet />
            </div>
              <Footer />
            
        </div>
    )
}



const AuthLayout =()=>{

  const location=useLocation()

  const { isLoggedIn } = useAppContext();
  const hiddenPaths = ["/sign-in", "/register", "/detail"];
  const isHidden = hiddenPaths.includes(location.pathname);

   if(!isLoggedIn) return <Navigate to={"/sign-in"} state={{ from: location }} replace/>


   
    return (
        <div className="flex flex-col min-h-screen">

           <Header />
           <Hero />

            <div className={`${isHidden ? "hidden" : "block"} container mx-auto`}>
             <SearchBar />
            </div>

            <div className="container mx-auto py-10 flex-1">
              <ScrollToTop />
              <Outlet />
            </div>
              <Footer />
            
        </div>
    )
};



export { MainLayout,AuthLayout}