import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api/api-client";
import moment from "moment";
import { useState } from "react";
import { FiTrash2, FiCalendar, FiUsers, FiMapPin, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiStar } from "react-icons/fi";
import CancelConfirmationModal from "../components/CancelConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

interface Booking {
  _id: string;
  adultCount: number;
  checkIn: string;
  checkOut: string;
  childCount: number;
  paymentIntentId?: string;
  hotelid?: string;
  isCancelled: boolean;
}

export interface Hotel {
  _id: string;
  name: string;
  city: string;
  country: string;
  imageUrls: string[];
  bookings: Booking[];
  starRating: number;
  facilities: string[];
  type: string;
}

const MyBookings = () => {
  const queryClient = useQueryClient();
  const navigate=useNavigate();
  const { showToast }=useAppContext();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const hotelsPerPage = 4;
  
  const { data: hotels, isLoading, isError } = useQuery({
    queryKey: ["fetchMyBookings"],
    queryFn: () => apiClient.fetchmyBookings(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  

  const { mutate: cancelBooking } = useMutation({
    mutationFn: (booking: Booking) => 
      apiClient.cancelBooking(booking.hotelid || '', booking.paymentIntentId || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchMyBookings"] });
      showToast({message: "Booking cancelled and check gmail for more details",type:'SUCCESS',duration:3000})
      setCancellingId(null);
    },
    onError: (error: Error) => {
      console.error(error.message);
      setCancellingId(null);
    }
  });

  const handleCancelClick = (booking: Booking) => {
    if (booking.isCancelled) return;
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking && !selectedBooking.isCancelled) {
      setCancellingId(selectedBooking._id);
      cancelBooking(selectedBooking); //from mutation
    }
  };

  const hotelsWithBookings = (hotels || []).filter(hotel => hotel?.bookings?.length > 0);

  const totalHotels = hotelsWithBookings.length;
  const totalPages = Math.ceil(totalHotels / hotelsPerPage);
  const paginatedHotels = hotelsWithBookings.slice(
    (currentPage - 1) * hotelsPerPage,
    currentPage * hotelsPerPage
  );

  const toggleHotelExpansion = (hotelId: string) => {
    setExpandedHotelId(prev => prev === hotelId ? null : hotelId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i}
            className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-4 h-4`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 font-medium">Failed to load your bookings</p>
          <p className="text-gray-600 mt-2">Please try again later or contact support if the problem persists.</p>
          <button 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            onClick={() => queryClient.refetchQueries({ queryKey: ["fetchMyBookings"] })}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            {totalHotels > 0 && `Showing ${(currentPage - 1) * hotelsPerPage + 1}-${Math.min(currentPage * hotelsPerPage, totalHotels)} of ${totalHotels} hotels`}
          </div>
        </div>
        
        {totalHotels === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FiCalendar className="text-gray-400" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No bookings yet</h2>
              <p className="text-gray-600 mb-6">You haven't made any bookings yet. When you do, they'll appear here.</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-sm"
               onClick={()=> navigate("/search")}
              >
                Browse Hotels
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedHotels.map((hotel) => (
              <div 
                key={hotel._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto">
                    <img
                      src={hotel.imageUrls?.[0] || "/placeholder-hotel.jpg"}
                      className="w-full h-full object-cover"
                      alt={hotel.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-hotel.jpg";
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">{hotel.name}</h2>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <FiMapPin className="mr-1.5" size={14} />
                          <span>{hotel.city}, {hotel.country}</span>
                        </div>
                        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                         <span className="capitalize">{hotel.type?.toLowerCase()}</span>
                        </div>
                        <div className="mb-2">
                          {renderStars(hotel.starRating || 0)}
                        </div>
                        {(hotel.facilities?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 mb-2">
                            {hotel.facilities?.slice(0, 3).map((facility, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                              >
                                {facility}
                              </span>
                            ))}
                            {(hotel.facilities?.length ?? 0) > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                +{(hotel.facilities?.length || 0) - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHotelExpansion(hotel._id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={expandedHotelId === hotel._id ? "Collapse bookings" : "Expand bookings"}
                      >
                        {expandedHotelId === hotel._id ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </button>
                    </div>

                    {expandedHotelId === hotel._id && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Your Bookings</h3>
                        <div 
                          className={`space-y-4 ${(hotel.bookings?.length ?? 0) > 3 ? 'max-h-60 overflow-y-auto pr-2' : ''}`}
                        >
                          {hotel.bookings?.map((booking) => (
                            <div 
                              key={booking._id} 
                              className={`flex flex-col sm:flex-row justify-between gap-4 p-3 rounded-lg ${
                                booking.isCancelled 
                                  ? 'bg-gray-100 opacity-70' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <FiCalendar className={`${booking.isCancelled ? 'text-gray-500' : 'text-indigo-600'} mt-0.5 mr-2`} size={16} />
                                  <div>
                                    <p className={`text-sm font-medium ${booking.isCancelled ? 'text-gray-500' : 'text-gray-700'}`}>Dates</p>
                                    <p className={`text-sm ${booking.isCancelled ? 'text-gray-500' : 'text-gray-600'}`}>
                                      {moment(booking.checkIn).format("MMM Do, YYYY")} - {moment(booking.checkOut).format("MMM Do, YYYY")}
                      
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <FiUsers className={`${booking.isCancelled ? 'text-gray-500' : 'text-indigo-600'} mt-0.5 mr-2`} size={16} />
                                  <div>
                                    <p className={`text-sm font-medium ${booking.isCancelled ? 'text-gray-500' : 'text-gray-700'}`}>Guests</p>
                                    <p className={`text-sm ${booking.isCancelled ? 'text-gray-500' : 'text-gray-600'}`}>
                                      {booking.adultCount} adults, {booking.childCount} children
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col md:items-center justify-center items-end">
                                {booking.isCancelled ? (
                                 <span className="text-black/80 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 bg-gray-100 hover:ring-1 hover:ring-gray-300 transition-all duration-200 tracking-wider">
                                 Booking cancelled!
                             </span>
                                ) : (
                                  <button
                                    onClick={() => handleCancelClick(booking)}
                                    disabled={cancellingId === booking._id}
                                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 flex items-center text-sm font-medium"
                                    aria-label={`Cancel booking from ${moment(booking.checkIn).format("MMM Do")} to ${moment(booking.checkOut).format("MMM Do")}`}
                                  >
                                    {cancellingId === booking._id ? (
                                      <>
                                        <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
                                        Cancelling...
                                      </>
                                    ) : (
                                      <>
                                        <span className="flex items-center px-3 py-1.5 text-xs font-medium text-red-500 rounded-full border border-red-200 bg-red-50 hover:bg-red-100/40 hover:ring-1 hover:ring-red-300 transition-all duration-200 tracking-wider">
                                        <FiTrash2 className="mr-1.5" size={14} />
                                         Cancel
                                     </span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <div className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="mr-1" size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FiChevronRight className="ml-1" size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        bookingDetails={selectedBooking ? {
          checkIn: selectedBooking.checkIn,
          checkOut: selectedBooking.checkOut,
        } : null}
      />
    </div>
  );
};

export default MyBookings;
