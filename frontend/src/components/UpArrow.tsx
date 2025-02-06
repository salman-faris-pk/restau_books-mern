import { MdKeyboardArrowUp } from "react-icons/md";

const UpArrow = () => {

    const handleTop=()=> {
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
    }
  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 md:right-10 w-12 h-12 bg-blue-700
     text-white rounded-full flex items-center justify-center border border-blue-600 text-2xl shadow-blue-900 shadow-sm cursor-pointer z-50 transition-transform 
       duration-300 hover:scale-105" onClick={handleTop}>
      <MdKeyboardArrowUp size={32} />
    </div>
  );
};

export default UpArrow;