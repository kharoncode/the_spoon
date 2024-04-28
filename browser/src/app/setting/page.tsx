'use client';
import useFetch from '@/utils/useFetch';
import React from 'react';
import OpeningTimeSetting from '@/components/OpeningTimeSetting';

type Opening = {
   [key: string]: [
      {
         content: string;
         day_time: 'lunch' | 'diner';
         start_time: number;
         end_time: number;
      }
   ];
};

const Setting = () => {
   const { data, isLoading, error } = useFetch<Opening>(
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
      <React.Fragment>
         <div className="w-3/4 flex flex-col gap-5">
            <h2>Ouverture</h2>

            <div className="w-full flex justify-center flex-col gap-16">
               {!isLoading &&
                  data &&
                  days_list.map((day) => (
                     <div key={day} className="flex flex-col w-full gap-2">
                        <h3>{day.toUpperCase()}</h3>
                        <div className="flex flex-col gap-5">
                           {data[day].map((day_time, index) => {
                              return (
                                 <div
                                    key={`${day}_${index}`}
                                    className="flex gap-8"
                                 >
                                    <div>
                                       <h4 className="capitalize">
                                          {day_time.day_time}
                                       </h4>
                                       <OpeningTimeSetting
                                          day_time={day_time.day_time}
                                          start_time={day_time.start_time / 60}
                                          end_time={day_time.end_time / 60}
                                          content={day_time.content}
                                       />
                                       <p>{day_time.content}</p>
                                    </div>
                                    <button>Close ?</button>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  ))}
            </div>
         </div>
      </React.Fragment>
   );
};

export default Setting;
