import Header from "../components/Header";
import { Navigate, Outlet, useLocation } from "react-router-dom"
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useAppContext } from "../contexts/AppContext";
import SearchBar from "../components/SearchBar";
import { ScrollToTop } from "../utils/ScrollToTop";
import MobNav from "../components/MobNav";
import UpArrow from "../components/UpArrow";




const MainLayout =( )=>{

  const location=useLocation()
  const shownPaths = ["/", "/search"];
  const isShown = shownPaths.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <MobNav/>
           <Header />
           <Hero />

           <div className={`${isShown ? "block" : "hidden"} container mx-auto`}>
             <SearchBar />
            </div>

            <div className="container mx-auto py-10 flex-1">
               <Outlet />
            </div>
               <UpArrow/>
              <Footer />
        </div>
    )
}



const AuthLayout =()=>{

  const location=useLocation()

  const { isLoggedIn } = useAppContext();
  const shownPaths = ["/", "/search"];
  const isShown = shownPaths.includes(location.pathname);

   if(!isLoggedIn) return <Navigate to={"/sign-in"} state={{ from: location }}/>


   
    return (
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />

           <Header />
        
           <Hero />

            <div className={`${isShown ? "block" : "hidden"} container mx-auto`}>
             <SearchBar />
            </div>

            <div className="container mx-auto py-10 flex-1">
              <Outlet />
            </div>
               
              <Footer />
              
              <UpArrow/>
           
          <MobNav/>

        </div>
    )
};



export { MainLayout,AuthLayout}