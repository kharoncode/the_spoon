'use client';
import useFetch from '@/utils/useFetch';
import React from 'react';

type Opening = {
   [key: string]: number[];
};

const Setting = () => {
   const { data, isLoading, error } = useFetch<Opening>(
      'http://127.0.0.1:5000/days/list'
   );
   return (
      <React.Fragment>
         <div className="w-3/4 flex flex-col gap-5">
            <h2>Ouverture</h2>
            {!isLoading &&
               data &&
               Object.keys(data).map((day) => (
                  <div key={day} className="flex flex-col gap-2">
                     <h3>{day}</h3>
                     <div className="flex flex-wrap gap-5">
                        {data[day].map((h, index) => {
                           const hour = (h / 60).toString().split('.');
                           return (
                              <p key={`${day}_${h}_${index}`}>
                                 {hour[0]}:
                                 {hour[1] ? Number(`0.${hour[1]}`) * 60 : '00'}
                              </p>
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
