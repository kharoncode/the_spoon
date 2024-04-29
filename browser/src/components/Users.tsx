'use client';
import useFetch, { FetchData } from '@/utils/useFetch';
import React, { use, useEffect, useState } from 'react';

type user = {
   id: number;
   name: string;
};

export const Users = () => {
   const [users, setUsers] = useState<user[]>([]);

   useEffect(() => {
      fetch('http://127.0.0.1:5000/users')
         .then((res) => res.json())
         .then((data) => setUsers(data));
   }, []);

   const handleDelete = (id: number) => {
      fetch('http://127.0.0.1:5000/users', {
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
         .then((data) => setUsers(data));
   };
   return (
      <div className="flex flex-col gap-5">
         {users.map((user, index) => {
            return (
               <div key={index} className="w-80 flex justify-around">
                  <p className="w-1/2 text-xl">{user.name}</p>
                  <button
                     onClick={() => handleDelete(user.id)}
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
