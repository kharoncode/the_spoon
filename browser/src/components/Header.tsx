import Link from 'next/link';
import React from 'react';

const Header = () => {
   return (
      <header className="p-5 flex gap-5">
         <Link href={'/'}>HOME</Link>
      </header>
   );
};

export default Header;