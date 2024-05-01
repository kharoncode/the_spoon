import React, { useEffect, useState } from 'react';

const Booking_CustomersNbr = ({
   date,
   setcustomerNbr,
}: {
   date: number;
   setcustomerNbr: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
   const [tables, setTables] = useState<{
      bigger_size: number;
      max_available: number;
   }>();
   useEffect(() => {
      fetch(`http://127.0.0.1:5000/tables/max-size-available?date=${date}`)
         .then((res) => res.json())
         .then((data) => setTables(data));
   }, [date]);

   return (
      <div className="p-5 flex flex-col items-center gap-5">
         <h3>Nombre de personnes</h3>
         {tables && (
            <div className="flex justify-center flex-wrap gap-3">
               {Array.from(
                  { length: tables.bigger_size },
                  (el, index) => index + 1
               ).map((el, index) => (
                  <div
                     className={`w-10 p-2 border rounded-lg border-gray-300 ${
                        el > tables.max_available
                           ? ' bg-gray-100 cursor-not-allowed opacity-60'
                           : 'cursor-pointer'
                     } hover:bg-gray-100 text-center`}
                     key={index}
                     onClick={() => {
                        el <= tables.max_available && setcustomerNbr(el);
                     }}
                  >
                     {el}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default Booking_CustomersNbr;
