import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
 
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Optional ,scrolling animation
    });

   
  }, [pathname]);

  return null;
};