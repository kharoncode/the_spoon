'use client';
import LoginForm from '@/components/LoginForm';
import useFetch from '@/utils/useFetch';
import React from 'react';

type user = {
   id: number;
   name: string;
};

export default function Home() {
   const { data: users, isLoading } = useFetch<user[]>(
      'http://127.0.0.1:5000/users'
   );
   return (
      <React.Fragment>
         <h1>The Spoon</h1>
         <LoginForm />
         {!isLoading &&
            users &&
            users.map((el, index) => {
               return <div key={index}>{el.name}</div>;
            })}
      </React.Fragment>
   );
}
