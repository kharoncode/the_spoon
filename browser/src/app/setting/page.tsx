'use client';
import useFetch from '@/utils/useFetch';
import React, { useState } from 'react';
import OpeningTimeSetting from '@/components/OpeningTimeSetting';

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
      console.log(body.filter((el) => el != null));
   };

   return (
      <React.Fragment>
         <h2>Ouverture</h2>
         <button onClick={handleSubmit}>Submit</button>
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
                              <OpeningTimeSetting
                                 key={`${day}_${index}`}
                                 day_time={day_time.day_time}
                                 start_time={day_time.start_time / 60}
                                 end_time={day_time.end_time / 60}
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
