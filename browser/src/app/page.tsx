'use client';
import LoginForm from '@/components/LoginForm';
import useFetch from '@/utils/useFetch';
import Link from 'next/link';
import React from 'react';

type user = {
   id: number;
   name: string;
};

type Opening = {
   [key: string]: [
      {
         content: string;
         day_time: string;
         start_time: number;
         end_time: number;
      },
      {
         content: string;
         day_time: string;
         start_time: number;
         end_time: number;
      }
   ];
};

export default function Home() {
   const { data: users, isLoading: iL_user } = useFetch<user[]>(
      'http://127.0.0.1:5000/users'
   );

   const { data: data_ot, isLoading: iL_ot } = useFetch<Opening>(
      'http://127.0.0.1:5000/days'
   );

   const days_list = [
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
   ];

   return (
      <div className="p-5 flex flex-col items-center gap-8">
         <h1 className="w-full text-center mb-3 text-3xl font-bold">
            The Spoon
         </h1>
         <div className="w-1/2 flex justify-around gap-50">
            <LoginForm />
            <div className="p-5 flex flex-col text-center gap-2">
               <h2 className="w-full text-center text-lg font-medium">
                  Liste des Utilisateurs :
               </h2>
               {!iL_user &&
                  users &&
                  users.map((el, index) => {
                     return (
                        <Link href={`/user/${el.id}`} key={`${el.id}-${index}`}>
                           {el.name}
                        </Link>
                     );
                  })}
            </div>
         </div>
         <div className="w-1/2 flex flex-col gap-4">
            <h2 className="text-xl text-center font-medium">
               {"Horaires d'Ouverture"}
            </h2>
            <div className="flex justify-between flex-wrap gap-5">
               {!iL_ot &&
                  data_ot &&
                  days_list.map((day, index) => (
                     <div key={`${day}-${index}`} className="flex gap-2">
                        <h3>{day.toUpperCase()} :</h3>
                        {data_ot[day][0].content === 'closed' &&
                        data_ot[day][1].content === 'closed' ? (
                           <p>Fermée</p>
                        ) : (
                           data_ot[day].map((el, index) =>
                              el.content === 'closed' ? (
                                 <></>
                              ) : (
                                 <p key={index}>{el.content}</p>
                              )
                           )
                        )}
                     </div>
                  ))}
            </div>
         </div>
      </div>
   );
}
