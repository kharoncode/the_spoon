'use client';
import useFetch from '@/utils/useFetch';
import React from 'react';

type Data = {
   id: number;
   name: string;
};

type Opening = {
   [key: string]: number[];
};

const User = ({ params }: { params: { id: string } }) => {
   const { data: data_user, isLoading: iL_user } = useFetch<Data>(
      `http://127.0.0.1:5000/user/search?id=${params.id}`
   );
   const { data: data_days, isLoading: iL_days } = useFetch<Opening>(
      'http://127.0.0.1:5000/days/list'
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
      <div>
         {!iL_user && data_user && data_user.id
            ? ` Welcome User#${data_user.id} ${data_user.name}`
            : 'User not Found !'}
         {!iL_days &&
            data_days &&
            days_list.map((day) => (
               <div key={day} className="flex flex-col gap-2">
                  <h3>{day.toUpperCase()}</h3>
                  <div className="flex flex-wrap gap-5">
                     {data_days[day].map((h, index) => {
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
   );
};

export default User;
