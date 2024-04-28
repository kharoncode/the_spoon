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
      <div className="w-full flex flex-col items-center gap-10">
         <div className="flex flex-col gap-2 w-80">
            <h2>Utilisateurs :</h2>
            <Users />
         </div>
         <div className="flex flex-col gap-2 w-80">
            <h2>Tables :</h2>
            <Tables />
         </div>
      </div>
   );
};

export default Settings;
