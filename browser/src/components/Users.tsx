'use client';
import useFetch from '@/utils/useFetch';
import React from 'react';

type user = {
   id: number;
   name: string;
};

export const Users = () => {
   const { data } = useFetch<user[]>('http://127.0.0.1:5000/users');
   return (
      <div>
         {data &&
            data.map((el, index) => {
               return <p key={index}>{el.name}</p>;
            })}
      </div>
   );
};
