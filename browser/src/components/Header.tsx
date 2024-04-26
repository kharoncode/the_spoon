import Link from 'next/link';
import React from 'react';

const Header = () => {
   return (
      <header className="p-5 flex gap-5">
         <Link href={'/'}>HOME</Link>
         <Link href={'/setting'}>SETTING</Link>
      </header>
   );
};

export default Header;
