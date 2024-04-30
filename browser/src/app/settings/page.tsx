'use client';
import Tables from '@/components/Tables';
import { Users } from '@/components/Users';
import React from 'react';

const Settings = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   return (
      <div className="p-5 w-full flex justify-around">
         <div className="flex flex-col gap-2 w-80">
            <h2 className="text-center text-2xl">Utilisateurs :</h2>
            <Users />
         </div>
         <div className="flex flex-col gap-2 w-80">
            <h2 className="text-center text-2xl">Tables :</h2>
            <Tables />
         </div>
      </div>
   );
};

export default Settings;
