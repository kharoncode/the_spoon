import Link from 'next/link';
import React from 'react';

const Header = () => {
   return (
      <header className="p-3 flex gap-5 bg-blue-100">
         <Link className="font-medium text-lg" href={'/'}>
            HOME
         </Link>
         <Link className="font-medium text-lg" href={'/settings'}>
            SETTINGS
         </Link>
      </header>
   );
};

export default Header;
