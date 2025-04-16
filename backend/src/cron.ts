import cron from "node-cron"
import https from "https"



const URL ='https://restau-booking-mern.onrender.com/';


const CronJob = cron.schedule('*/14 * * * *', function () {
    https
      .get(URL, (res) => {
        if (res.statusCode === 200) {
          console.log("GET request sent successfully");
        } else {
          console.log("GET request failed", res.statusCode);
        } 
      })
      .on("error", (e) => {
        console.error("Error while sending request", e);
      });
  });


  export default CronJob;