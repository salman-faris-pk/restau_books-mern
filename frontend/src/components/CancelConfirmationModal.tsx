import { useEffect, useState } from "react";
import moment from "moment";
import { FiTrash2 } from "react-icons/fi";

interface BookingDetails {
  checkIn: string;
  checkOut: string;
}

interface CancelConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: BookingDetails | null;
}

const CancelConfirmationModal = ({ isOpen, onClose,onConfirm, bookingDetails}: CancelConfirmationModalProps) => {

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "auto";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsCancelling(true);
    onConfirm();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCancelling(false);
    onClose();
  };

  const handleClose = () => {
    if (!isCancelling) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">

      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-slate-700 opacity-65"
          onClick={handleClose}
        ></div>

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg mx-4">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isCancelling ? "Cancelling booking..." : "Cancel booking"}
                </h3>
                <div className="mt-2">
                  {isCancelling ? (
                    <p className="text-sm text-gray-500">
                      Your booking is being cancelled...
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancel your booking from{" "}
                      <span className="font-medium">
                        {moment(bookingDetails?.checkIn).format("MMM Do, YYYY")}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {moment(bookingDetails?.checkOut).format("MMM Do, YYYY")}
                      </span>
                      ? This action cannot be undone.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                isCancelling
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              }`}
              onClick={handleConfirm}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cancelling...
                </span>
              ) : (
                "Cancel Booking"
              )}
            </button>
            <button
              type="button"
              className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                isCancelling
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={handleClose}
              disabled={isCancelling}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;