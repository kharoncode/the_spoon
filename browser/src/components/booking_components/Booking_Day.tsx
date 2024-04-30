import React from 'react';
import { formatTime } from '../openingDayCard/OpeningDayCard';

const isHourUnvalide = (
   bookings_list: number[],
   hour: number,
   date: number
) => {
   const fullDate = hour * 60000 + date;
   for (let i = 0; i < bookings_list.length; i++) {
      console.log(i);
      if (
         fullDate > bookings_list[i] - 5400000 &&
         fullDate < bookings_list[i] + 5400000
      ) {
         return true;
      }
   }
   return false;
};

type props = {
   dayList: { [key: number]: [number[], number[]] };
   day: number;
   date: number;
   bookings_list: number[];
   setHour: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const ValideHourComponent = ({
   hour,
   setHour,
}: {
   hour: number;
   setHour: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
   return (
      <div
         className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100"
         onClick={() => setHour(hour * 60000)}
      >
         {formatTime(hour / 60)}
      </div>
   );
};

const UnvalideHourComponent = ({ hour }: { hour: number }) => {
   return (
      <div
         className={`p-2  border rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed opacity-60 flex flex-col items-center`}
      >
         {formatTime(hour / 60)}
      </div>
   );
};

const Booking_Day = ({ dayList, day, date, bookings_list, setHour }: props) => {
   return (
      <div className="p-5 flex flex-col gap-3">
         {dayList[day][0].length > 0 && (
            <>
               <h3>Lunch</h3>
               <div className="flex justify-center flex-wrap gap-3">
                  {dayList[day][0].map((h, index) => {
                     if (isHourUnvalide(bookings_list, h, date)) {
                        return <UnvalideHourComponent key={index} hour={h} />;
                     } else {
                        return (
                           <ValideHourComponent
                              key={index}
                              hour={h}
                              setHour={setHour}
                           />
                        );
                     }
                  })}
               </div>
            </>
         )}
         {dayList[day][1].length > 0 && (
            <>
               <h3>Dinner</h3>
               <div className="flex justify-center flex-wrap gap-3">
                  {dayList[day][1].map((h, index) => {
                     if (isHourUnvalide(bookings_list, h, date)) {
                        return <UnvalideHourComponent key={index} hour={h} />;
                     } else {
                        return (
                           <ValideHourComponent
                              key={index}
                              hour={h}
                              setHour={setHour}
                           />
                        );
                     }
                  })}
               </div>
            </>
         )}
      </div>
   );
};

export default Booking_Day;
