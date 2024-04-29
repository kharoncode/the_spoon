import Link from 'next/link';
import React from 'react';

export default function SettingsLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <React.Fragment>
         <nav className="p-5 flex gap-5 self-start">
            <Link href={'/settings'}>Utilisateurs/Tables</Link>
            <Link href={'/settings/opening-time'}>{"Heures d'Ouverture"}</Link>
            <Link href={'/settings/bookings'}>Réservations</Link>
         </nav>
         {children}
      </React.Fragment>
   );
}
