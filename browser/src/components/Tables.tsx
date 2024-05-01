import useFetch from '@/utils/useFetch';
import React, {
   FormEvent,
   TableHTMLAttributes,
   useEffect,
   useState,
} from 'react';

type table = {
   id: number;
   size: number;
   name: string;
};

const Tables = () => {
   const [tables, setTables] = useState<table[]>([]);

   useEffect(() => {
      fetch('http://127.0.0.1:5000/tables')
         .then((res) => res.json())
         .then((data) => setTables(data));
   }, []);

   const handleDelete = (id: number) => {
      fetch('http://127.0.0.1:5000/tables', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id: id }),
      })
         .then((res) => {
            {
               return res.json();
            }
         })
         .then((data) => setTables(data));
   };

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const name = e.currentTarget.tableName.value;
      const size = Number(e.currentTarget.tableSize.value);
      fetch('http://127.0.0.1:5000/tables', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ name: name, size: size }),
      })
         .then((res) => {
            {
               return res.json();
            }
         })
         .then((data) => setTables(data));
   };

   return (
      <div className="flex flex-col gap-5">
         <div className="flex flex-col gap-5">
            {tables.map((table, index) => {
               return (
                  <div key={index} className="w-80 flex justify-around">
                     <p className="w-1/3 text-xl">{table.name}</p>
                     <p className="w-1/3 text-lg">{table.size} personnes</p>
                     <button
                        onClick={() => handleDelete(table.id)}
                        className="w-5 fill-red-800 hover:fill-red-600"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 448 512"
                        >
                           <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                        </svg>
                     </button>
                  </div>
               );
            })}
         </div>
         <form
            onSubmit={handleSubmit}
            className="w-80 p-4 flex flex-col items-center gap-5 bg-blue-200 border border-blue-500 rounded-xl"
         >
            <h2 className="text-xl">Ajouter une table</h2>
            <div className="flex gap-4">
               <label htmlFor="tableName">Nom</label>
               <input
                  className="pl-2"
                  type="text"
                  id="tableName"
                  name="tableName"
               />
            </div>
            <div className="flex gap-4">
               <label htmlFor="tableSize">Taille</label>
               <input
                  className="pl-2 rounded-sm"
                  type="number"
                  id="tableSize"
                  name="tableSize"
               />
            </div>
            <button
               className="p-2 bg-blue-100 border-2 hover:border-blue-300 rounded-md"
               type="submit"
            >
               Ajouter
            </button>
         </form>
      </div>
   );
};

export default Tables;
