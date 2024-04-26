'use client';
import useFetch from '@/utils/useFetch';
import React from 'react';

type Data = {
   id: number;
   name: string;
};

const User = ({ params }: { params: { id: string } }) => {
   const { data, isLoading, error } = useFetch<Data>(
      `http://127.0.0.1:5000/user/search?id=${params.id}`
   );
   return (
      <div>
         {!isLoading && data && data.id
            ? ` Welcome User#${data.id} ${data.name}`
            : 'User not Found !'}
      </div>
   );
};

export default User;
