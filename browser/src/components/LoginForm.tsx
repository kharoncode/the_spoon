'use client';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';

const LoginForm = () => {
   const router = useRouter();
   const [error, setError] = useState('');
   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const btn = event.currentTarget.subBTN.firstChild.data;
      if (btn == 'Se connecter') {
         fetch(
            `http://127.0.0.1:5000/user/search?name=${event.currentTarget.userName.value}`
         )
            .then((res) => res.json())
            .then((data) => {
               if (data) {
                  data.id && router.replace(`/user/${data.id}`);
                  data.message && setError(data.message);
               }
            });
      } else {
         fetch('http://127.0.0.1:5000/users', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: event.currentTarget.userName.value }),
         })
            .then((res) => res.json())
            .then((data) => {
               data.id && router.replace(`/user/${data.id}`);
            });
      }
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="w-80 p-4 flex flex-col items-center gap-5 bg-blue-200 border border-blue-500 rounded-xl"
      >
         <label htmlFor="userName">Utilisateur :</label>
         <input
            type="text"
            id="userName"
            name="userName"
            className="w-4/5 pl-2"
         />
         <button
            id="subBTN"
            type="submit"
            className={`p-2 bg-blue-100 rounded-md ${
               error === 'User not found !' && 'border-4 border-red-500'
            }`}
         >
            {error === 'User not found !' ? "S'inscrire" : 'Se connecter'}
         </button>
         <p className="w-4/5 text-center">{error}</p>
      </form>
   );
};

export default LoginForm;
