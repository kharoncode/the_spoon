'use client';
import { formatTime } from '@/components/openingDayCard/OpeningDayCard';
import useFetch from '@/utils/useFetch';
import React, { FormEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Data = {
   id: number;
   name: string;
};

type selectedDate = { date: number; day: number };

type Opening = {
   [key: string]: number[];
};

const formatDate = (date: number) => {
   const newDate = new Date(date);
   const day = newDate.getDate();
   const month = newDate.getMonth() + 1;
   const year = newDate.getFullYear();
   const strDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
   }/${year}`;
   return strDate;
};

const tableFilter = (
   tableList: { name: string; size: number; id: number }[],
   customerNbr: number
) => {
   const filteredList = tableList
      .filter((el) => el.size >= customerNbr)
      .sort((a, b) => a.size - b.size);
   return filteredList;
};

const User = ({ params }: { params: { id: string } }) => {
   const [dayList, setDayList] = useState<{
      [key: number]: [number[], number[]];
   }>();
   const [disabledDaysList, setDisabledDaysList] = useState<number[]>([]);
   const { data: data_user, isLoading: iL_user } = useFetch<Data>(
      `http://127.0.0.1:5000/user/search?id=${params.id}`
   );
   const [tablesList, setTablesList] =
      useState<{ id: number; name: string; size: number }[]>();

   useEffect(() => {
      fetch('http://127.0.0.1:5000/opening-times/open-days')
         .then((res) => res.json())
         .then((data) => setDisabledDaysList(data));
      fetch('http://127.0.0.1:5000/days/list')
         .then((res) => res.json())
         .then((data) => setDayList(data));
   }, []);

   const [date, setDate] = useState<selectedDate>();
   const [hour, setHour] = useState<number>();
   const [customerNbr, setcustomerNbr] = useState<number>();
   const [tableId, setTableId] = useState<number>();
   const [result, setResult] = useState<string>();
   const [isPending, setIsPending] = useState(false);
   const [alert, setAlert] = useState(false);

   useEffect(() => {
      if (date && date.date && hour) {
         fetch(
            `http://127.0.0.1:5000/tables/available?date=${date.date + hour}`
         )
            .then((res) => res.json())
            .then((data) => setTablesList(data));
      }
   }, [date, hour]);

   const handleSubmit = (status: string, table_id_props?: number) => {
      if (
         params.id &&
         date &&
         hour &&
         customerNbr &&
         (tableId || table_id_props)
      ) {
         const body = {
            customers_nbr: customerNbr,
            date: date.date + hour,
            status: status,
            table_id: table_id_props ? table_id_props : tableId,
            user_id: params.id,
         };

         fetch('http://127.0.0.1:5000/bookings', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
         })
            .then((res) => res.json())
            .then((data) => {
               if ((data.status = 'time_out')) {
                  setIsPending(false);
                  setAlert(true);
               }
               setResult(data.message);
            });
      }
   };

   const isDisabledDay = (date: Date, disabledDays: number[]) => {
      const day = date.getDay();
      return !disabledDays.includes(day);
   };

   return (
      <div className="w-full flex flex-col items-center gap-8">
         <h1 className="text-center text-xl text-bold">
            {!iL_user && data_user && data_user.id
               ? ` Welcome User#${data_user.id} ${data_user.name}`
               : 'User not Found !'}
         </h1>
         <div className="w-96 flex flex-col border-2 rounded-xl items-center">
            <h2 className="p-2 text-center font-bold text-xl">
               Faire une réservation :
            </h2>
            <div className="p-2 flex gap-1">
               <div
                  className="p-2 font-bold bg-emerald-800 cursor-pointer rounded-tl-xl rounded-bl-xl text-white "
                  onClick={() => {
                     setDate(undefined);
                     setHour(undefined);
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Date
               </div>
               <div
                  className={`p-2 font-bold ${!date && 'cursor-not-allowed'} ${
                     date && 'bg-emerald-800 text-white  cursor-pointer'
                  }`}
                  onClick={() => {
                     setHour(undefined);
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Heure
               </div>
               <div
                  className={`p-2 font-bold ${!hour && 'cursor-not-allowed'} ${
                     hour && 'bg-emerald-800 text-white  cursor-pointer'
                  }`}
                  onClick={() => {
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Nombre
               </div>
               <div
                  className={`p-2 font-bold ${
                     !customerNbr && 'cursor-not-allowed'
                  } ${
                     customerNbr && 'bg-emerald-800 text-white  cursor-pointer'
                  }`}
                  onClick={() => {
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Table
               </div>
               <div
                  className={`p-2 font-bold ${
                     !tableId && 'cursor-not-allowed'
                  } ${
                     tableId &&
                     'bg-emerald-800 rounded-tr-xl rounded-br-xl text-white '
                  }`}
               >
                  Final
               </div>
            </div>
            {!date ? (
               <div className="p-3 flex justify-center">
                  <DatePicker
                     inline
                     filterDate={(date: Date) =>
                        isDisabledDay(date, disabledDaysList)
                     }
                     onChange={(date: Date) =>
                        setDate({ date: date.getTime(), day: date.getDay() })
                     }
                     calendarStartDay={1}
                     minDate={new Date()}
                  />
               </div>
            ) : !hour ? (
               <>
                  {date.day && dayList && dayList[date.day].length > 0 && (
                     <div className="p-5 flex flex-col gap-3">
                        <h3>Lunch</h3>
                        <div className="flex justify-center flex-wrap gap-3">
                           {dayList[date.day][0].map((h, index) => (
                              <span
                                 className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100"
                                 onClick={() => setHour(h * 60000)}
                                 key={index}
                              >
                                 {formatTime(h / 60)}
                              </span>
                           ))}
                        </div>
                        <h3>Dinner</h3>
                        <div className="flex justify-center flex-wrap gap-3">
                           {dayList[date.day][1].map((h, index) => (
                              <span
                                 className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100"
                                 onClick={() => setHour(h * 60000)}
                                 key={index}
                              >
                                 {formatTime(h / 60)}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}
               </>
            ) : !customerNbr ? (
               <div className="p-5 flex flex-col items-center gap-5">
                  <h3>Nombre de personnes</h3>
                  <div className="flex justify-center flex-wrap gap-3">
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el, index) => (
                        <div
                           className="w-10 p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 text-center"
                           key={index}
                           onClick={() => setcustomerNbr(el)}
                        >
                           {el}
                        </div>
                     ))}
                  </div>
               </div>
            ) : !tableId ? (
               <div className="p-5 flex justify-center flex-wrap gap-3">
                  {tablesList &&
                  tableFilter(tablesList, customerNbr).length > 0 ? (
                     tableFilter(tablesList, customerNbr).map(
                        (table, index) => {
                           return (
                              <div
                                 className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 flex flex-col items-center"
                                 key={index}
                                 onClick={() => {
                                    handleSubmit('pending', table.id);
                                    setTableId(table.id);
                                 }}
                              >
                                 <p>{table.name}</p>
                                 <p>{table.size}</p>
                              </div>
                           );
                        }
                     )
                  ) : (
                     <p>Pas de table disponible</p>
                  )}
               </div>
            ) : (
               <div className="p-5 flex flex-col gap-5">
                  <h2>Résumé</h2>
                  <div>Date : {formatDate(date.date)}</div>
                  <div>Heure : {formatTime(hour / 3600000)}</div>
                  <div>Nbr : {customerNbr}</div>
                  <div>Table : {tableId}</div>
                  <button
                     className="p-2 bg-gray-100 font-bold cursor-pointer border rounded-lg border-gray-300 hover:bg-emerald-800 hover:text-white flex flex-col items-center"
                     onClick={() => handleSubmit('validate')}
                  >
                     Valider
                  </button>
               </div>
            )}
         </div>
         {result && <p>{result}</p>}
         {alert && (
            <div>
               <p>Êtes vous toujours là ?</p>
               <p
                  onClick={() => {
                     setIsPending(true);
                     setAlert(false);
                  }}
               >
                  Oui
               </p>
               <p>Non</p>
            </div>
         )}
      </div>
   );
};

export default User;
