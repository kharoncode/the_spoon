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
   user_name: string;
};

const formatDate = (date: number) => {
   const newDate = new Date(date);
   const day = newDate.getDate();
   const month = newDate.getMonth() + 1;
   const year = newDate.getFullYear();
   const hour = newDate.getHours();
   const minute = newDate.getMinutes();
   const strDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
   }/${year} à ${hour}:${minute < 10 ? '0' + minute : minute}`;
   return strDate;
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
      <div className="p-5 w-full flex flex-col items-center gap-5">
         <h2 className="text-center text-2xl">Listes des Réservations</h2>
         <div className="flex flex-wrap gap-5 justify-center">
            {bookings.map((booking, index) => {
               return (
                  <div
                     key={index}
                     className=" relative flex justify-center gap-5"
                  >
                     <div className="w-80 p-3 flex flex-col gap-4 border-2 border-gray-400 rounded-xl">
                        <div
                           className={`self-center w-fit p-2 rounded-lg text-transform: capitalize ${
                              booking.status === 'validate'
                                 ? 'bg-green-300'
                                 : 'bg-amber-300'
                           } text-center`}
                        >
                           {booking.status}
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-xl font-medium">
                              Réservation #{booking.id}
                           </h3>
                           <p className="text-sm italic">
                              Fait le : {booking.current_date}
                           </p>
                        </div>
                        <p>
                           Par : user#{booking.user_id} {booking.user_name}
                        </p>
                        <p>Pour le : {formatDate(booking.date)}</p>
                        <p>Table #{booking.table_id}</p>
                     </div>
                     <button
                        onClick={() => handleDelete(booking.id)}
                        className="absolute top-3 right-3 w-5 fill-red-800 hover:fill-red-600"
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
      </div>
   );
};

export default Bookings;
