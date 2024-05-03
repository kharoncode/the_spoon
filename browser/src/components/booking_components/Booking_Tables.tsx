import React, { useEffect, useState } from 'react';

type tables_info = {
   bookings: {
      booking_id: number;
      current_date: string;
      customers_nbr: number;
      date: number;
      status: string;
      user_id: number;
   }[];
   table_id: number;
   table_name: string;
   table_size: number;
};

type props = {
   date: { date: number; day: number };
   hour: number;
   customerNbr: number;
   setTableInfo: React.Dispatch<
      React.SetStateAction<
         | {
              size: number;
              id: number;
           }
         | undefined
      >
   >;
   handleSubmit: (
      status: string,
      table_id_props: number,
      table_size_props: number
   ) => void;
};

const Booking_Tables = ({
   date,
   hour,
   customerNbr,
   setTableInfo,
   handleSubmit,
}: props) => {
   const [tablesList, setTablesList] = useState<tables_info[]>();

   useEffect(() => {
      if (date && date.date && hour) {
         fetch(
            `http://127.0.0.1:5000/tables/available?date=${date.date + hour}`
         )
            .then((res) => res.json())
            .then((data) => {
               setTablesList(data);
            });
      }
   }, [date, hour]);

   const Table = ({ table }: { table: tables_info }) => {
      const isTableValide =
         table.table_size < customerNbr || table.bookings.length > 0;
      return (
         <div
            className={`p-2  border rounded-lg border-gray-300 hover:bg-gray-100 ${
               isTableValide
                  ? 'bg-gray-100 cursor-not-allowed opacity-60'
                  : 'cursor-pointer'
            } flex flex-col items-center`}
            onClick={() => {
               !isTableValide &&
                  handleSubmit('pending', table.table_id, table.table_size);
               !isTableValide &&
                  setTableInfo({
                     id: table.table_id,
                     size: table.table_size,
                  });
            }}
         >
            <p>{table.table_name}</p>
            <p>{table.table_size} Places</p>
         </div>
      );
   };

   return (
      <div className="p-5 flex justify-center flex-wrap gap-3">
         {tablesList &&
            tablesList.map((table, index) => {
               return <Table key={index} table={table} />;
            })}
      </div>
   );
};

export default Booking_Tables;
