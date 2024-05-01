'use client';
import React, { useEffect, useState } from 'react';
import { formatTime } from '../openingDayCard/OpeningDayCard';

const isHourUnvalide = (
   bookings_list: number[],
   hour: number,
   date: number,
   isInvalidHourList: {
      [key: number]: boolean;
   }
) => {
   const fullDate = hour * 60000 + date;
   if (fullDate < Date.now()) {
      return true;
   }
   if (isInvalidHourList[fullDate]) {
      return true;
   }
   for (let i = 0; i < bookings_list.length; i++) {
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
   day: number;
   date: number;
   bookings_list: number[];
   setHour: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const Booking_Day = ({ day, date, bookings_list, setHour }: props) => {
   const [dayList, setDayList] = useState<{
      [key: number]: [number[], number[]];
   }>();
   const [isInvalidHourList, setIsInvalidHourList] = useState<{
      [key: number]: boolean;
   }>();
   useEffect(() => {
      fetch(`http://127.0.0.1:5000/hours/isAvailable?date=${date}`)
         .then((res) => res.json())
         .then((data) => setIsInvalidHourList(data));
      fetch('http://127.0.0.1:5000/days/list')
         .then((res) => res.json())
         .then((data) => setDayList(data));
   }, [date]);

   const HourComponent = ({
      hour,
      setHour,
   }: {
      hour: number;
      setHour: React.Dispatch<React.SetStateAction<number | undefined>>;
   }) => {
      const isHour =
         isInvalidHourList &&
         isHourUnvalide(bookings_list, hour, date, isInvalidHourList);
      return (
         <>
            {isInvalidHourList && (
               <div
                  className={`p-2 ${
                     isHour
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : 'cursor-pointer'
                  } border rounded-lg border-gray-300 hover:bg-gray-100`}
                  onClick={() => {
                     !isHour && setHour(hour * 60000);
                  }}
               >
                  {formatTime(hour / 60)}
               </div>
            )}
         </>
      );
   };

   return (
      <>
         {dayList && isInvalidHourList && (
            <div className="p-5 flex flex-col gap-3">
               {dayList[day][0].length > 0 && (
                  <>
                     <h3>Lunch</h3>
                     <div className="flex justify-center flex-wrap gap-3">
                        {dayList[day][0].map((h, index) => (
                           <HourComponent
                              key={index}
                              hour={h}
                              setHour={setHour}
                           />
                        ))}
                     </div>
                  </>
               )}
               {dayList[day][1].length > 0 && (
                  <>
                     <h3>Dinner</h3>
                     <div className="flex justify-center flex-wrap gap-3">
                        {dayList[day][1].map((h, index) => {
                           return (
                              <HourComponent
                                 key={index}
                                 hour={h}
                                 setHour={setHour}
                              />
                           );
                        })}
                     </div>
                  </>
               )}
            </div>
         )}
      </>
   );
};

export default Booking_Day;
