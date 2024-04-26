'use client';
import LoginForm from '@/components/LoginForm';
import useFetch from '@/utils/useFetch';
import Link from 'next/link';
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
         <h1 className="w-full text-center mb-8 text-xl font-bold">
            The Spoon
         </h1>
         <div className="w-1/2 flex justify-around gap-50">
            <LoginForm />
            <div className="p-5 flex flex-col text-center gap-2">
               <h2 className="w-full text-center text-lg font-medium">
                  List des Utilisateurs :
               </h2>
               {!isLoading &&
                  users &&
                  users.map((el, index) => {
                     return (
                        <Link href={`/user/${el.id}`} key={index}>
                           {el.name}
                        </Link>
                     );
                  })}
            </div>
         </div>
      </React.Fragment>
   );
}
