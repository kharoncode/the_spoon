import useFetch from '@/utils/useFetch';
import React from 'react';

type table = {
   id: number;
   size: number;
   name: string;
};

const Tables = () => {
   const { data } = useFetch<table[]>('http://127.0.0.1:5000/tables');
   return (
      <div>
         {data &&
            data.map((el, index) => {
               return <p key={index}>{el.name}</p>;
            })}
      </div>
   );
};

export default Tables;
