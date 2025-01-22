import Header from "../components/Header";
import { Outlet } from "react-router-dom"
import Hero from "../components/Hero";
import Footer from "../components/Footer";


const MainLayout =( )=>{

  // const { isLoggedIn } = useAppContext();
    return (
        <div className="flex flex-col min-h-screen">

           <Header />
           <Hero />

           <div className="container mx-auto">
             {/* <SearchBar /> */}
            </div>

            <div className="container mx-auto py-10 flex-1">
               <Outlet />
            </div>
              <Footer />
            
        </div>
    )
}



const AuthLayout =()=>{

   
    return (
        <div className="flex flex-col min-h-screen">

           <Header />
           <Hero />

           <div className="container mx-auto">
             {/* <SearchBar /> */}
            </div>

            <div className="container mx-auto py-10 flex-1">
              <Outlet />
            </div>
              <Footer />
            
        </div>
    )
};



export { MainLayout,AuthLayout}