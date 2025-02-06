
const Footer = () => {
    return (
      <div className="bg-blue-800 py-10 z-40">
        <div className="md:container mx-auto flex justify-between items-center px-2">
          <span className="text-2xl md:text-3xl text-white font-bold tracking-tight">
              HolidayFeast.com
          </span>
          <span className="text-white/85 font-bold tracking-tight flex gap-4 text-xs md:text-lg">
            <p className="cursor-pointer">Privacy Policy</p>
            <p className="cursor-pointer">Terms of Service</p>
          </span>
        </div>
      </div>
    );
  };
  
  export default Footer;
  