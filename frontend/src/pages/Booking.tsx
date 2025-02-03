import { useQuery } from "@tanstack/react-query"
import * as apiclient from "../api/api-client"


const Booking = () => {

  const {data:currentuser}=useQuery({
    queryKey:["fetchCurrentUser"],
    queryFn: () => apiclient.fetchcurrentUser()
  });

   console.log(currentuser);
   
   
  return (
    <div>Booking</div>
  )
}

export default Booking