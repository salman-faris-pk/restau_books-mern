

type Props = {
    hotelId: string;
    pricePerNight: number;
  };

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
    console.log(hotelId);
    
  return (
    <div>GuestInfoForm</div>
  )
}

export default GuestInfoForm