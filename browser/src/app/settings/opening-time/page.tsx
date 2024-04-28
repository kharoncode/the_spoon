'use client';
import OpeningDayCard from '@/components/openingDayCard/OpeningDayCard';
import useFetch from '@/utils/useFetch';
import React, { useState } from 'react';

type Days_list = {
   [key: string]: [
      {
         content: string;
         day_time: 'lunch' | 'dinner';
         start_time: number;
         end_time: number;
         id: number;
      }
   ];
};

type Opening = {
   id: number;
   start_time: number;
   end_time: number;
   content: string;
}[];

const Setting = () => {
   const { data, isLoading } = useFetch<Days_list>(
      'http://127.0.0.1:5000/days'
   );

   const [body, setBody] = useState<Opening>([]);
   const [isSubmit, setIsSubmit] = useState(false);

   const days_list = [
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
   ];

   const handleSubmit = () => {
      const result = body.filter((el) => el != null);
      fetch('http://127.0.0.1:5000/opening-times', {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(result),
      })
         .then((res) => res.json())
         .then(() => {
            setBody([]);
            setIsSubmit(true);
            setTimeout(() => {
               setIsSubmit(false);
            }, 2000);
         });
   };

   return (
      <React.Fragment>
         <div className="w-full p-2 flex flex-col items-center gap-5">
            <h2 className="text-2xl text-bold">
               {"Modifier les Heures/Jours d'Ouverture"}
            </h2>
            <button
               onClick={handleSubmit}
               className="p-3 bg-indigo-600 rounded-xl text-white font-medium shadow-inner  hover:shadow-black"
            >
               Valider les modifications
            </button>
            <p
               className={`p-3 bg-green-100 rounded-xl border-2 border-green-400 text-center duration-500 ${
                  !isSubmit && 'opacity-0'
               }`}
            >
               Les modifications ont été appliqué.
            </p>
         </div>
         <div className="w-full p-5 flex justify-center flex-col items-center gap-16">
            {!isLoading &&
               data &&
               days_list.map((day) => (
                  <div
                     key={day}
                     className="w-full flex flex-col items-center gap-2"
                  >
                     <h3>{day.toUpperCase()}</h3>
                     <div className="w-full flex flex-col items-center gap-5">
                        {data[day].map((day_time, index) => {
                           return (
                              <OpeningDayCard
                                 key={`${day}_${index}`}
                                 day_time={day_time.day_time}
                                 start_time={day_time.start_time}
                                 end_time={day_time.end_time}
                                 content={day_time.content}
                                 setBody={setBody}
                                 id={day_time.id}
                              />
                           );
                        })}
                     </div>
                  </div>
               ))}
         </div>
      </React.Fragment>
   );
};

export default Setting;
