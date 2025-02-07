import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm"
import { hotelTypes } from "../../utils/hotel-type-options"


const TypeSection = () => {

  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("type");

  return (
    <div>
    <h2 className="text-2xl font-bold mb-3">Type</h2>

    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {hotelTypes.map((type,i) => (
        <label key={i}
          className={
            typeWatch === type
              ? "cursor-pointer bg-blue-400 text-white text-sm rounded-full px-4 py-2 font-semibold"
              : "cursor-pointer bg-gray-200 text-sm rounded-full px-4 py-2 font-semibold"
          }
        >
          <input
            type="radio"
            value={type}
            {...register("type", {
              required: "This field is required",
            })}
            className="hidden"
          />
          <span className="flex items-center justify-center">{type}</span>
        </label>
      ))}
    </div>
    {errors.type && (
      <span className="text-red-500 text-sm font-bold">
        {errors.type.message}
      </span>
    )}
  </div>
  )
}

export default TypeSection