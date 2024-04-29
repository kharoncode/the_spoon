'use client';
import React, { useEffect, useState } from 'react';

type booking = {
   current_date: '2024-04-29 10:44:22.316760';
   customers_nbr: number;
   date: number;
   id: number;
   status: string;
   table_id: number;
   user_id: number;
};

const Bookings = () => {
   const [bookings, setBookings] = useState<booking[]>([]);

   useEffect(() => {
      fetch('http://127.0.0.1:5000/bookings')
         .then((res) => res.json())
         .then((data) => setBookings(data));
   }, []);

   const handleDelete = (id: number) => {
      fetch('http://127.0.0.1:5000/bookings', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id: id }),
      })
         .then((res) => {
            {
               return res.json();
            }
         })
         .then((data) => setBookings(data));
   };

   return (
      <div className="w-full flex flex-col items-center gap-5">
         {bookings.map((booking, index) => {
            const newDate = new Date(booking.date);
            return (
               <div key={index} className="w-full flex justify-center gap-5">
                  <div className="w-1/3">
                     <h3 className="text-xl">Réservation #{booking.id}</h3>
                     <p>Réservation faite le : {booking.current_date}</p>
                     <p>Par : {booking.user_id}</p>
                     <p>Pour le : {`${newDate}`}</p>
                     <p>Table #{booking.table_id}</p>
                  </div>
                  <button
                     onClick={() => handleDelete(booking.id)}
                     className="w-5 fill-red-800 hover:fill-red-600"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                     >
                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                     </svg>
                  </button>
               </div>
            );
         })}
      </div>
   );
};

export default Bookings;
