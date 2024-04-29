'use client';
import { formatTime } from '@/components/openingDayCard/OpeningDayCard';
import useFetch from '@/utils/useFetch';
import { table } from 'console';
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
   /* const { data: data_days, isLoading: iL_days } = useFetch<Opening>(
      'http://127.0.0.1:5000/days/list'
   ); */
   const [date, setDate] = useState<selectedDate>();
   const [hour, setHour] = useState<number>();
   const [customerNbr, setcustomerNbr] = useState<number>();
   const [tableId, setTableId] = useState<number>();

   useEffect(() => {
      if (date && date.date && hour) {
         fetch(
            `http://127.0.0.1:5000/tables/available?date=${date.date + hour}`
         )
            .then((res) => res.json())
            .then((data) => setTablesList(data));
      }
   }, [date, hour]);

   const handleCustomerSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const nbr = e.currentTarget.customers.value;
      setcustomerNbr(nbr);
   };

   const handleSubmit = () => {
      if (params.id && date && hour && customerNbr && tableId) {
         const body = {
            current_date: new Date(),
            customers_nbr: customerNbr,
            date: date.date + hour,
            status: 'validate',
            table_id: tableId,
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
            .then((data) => console.log(data));
      }
   };

   const isDisabledDay = (date: Date, disabledDays: number[]) => {
      const day = date.getDay();
      return !disabledDays.includes(day);
   };

   return (
      <div className="flex flex-col items-center gap-8">
         <h1 className="text-center text-xl text-bold">
            {!iL_user && data_user && data_user.id
               ? ` Welcome User#${data_user.id} ${data_user.name}`
               : 'User not Found !'}
         </h1>
         <div className="w-80 flex flex-col border-2 rounded-xl">
            <h2 className="p-2 text-center text-lg bg-gray-100">
               Trouver une table
            </h2>
            <div className="p-3 flex gap-2">
               <div
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
                  onClick={() => {
                     setHour(undefined);
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Heure
               </div>
               <div
                  onClick={() => {
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Nombre
               </div>
               <div
                  onClick={() => {
                     setcustomerNbr(undefined);
                     setTableId(undefined);
                  }}
               >
                  Table
               </div>
               <div>Resumé + validation</div>
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
                     <div className="flex flex-col gap-3">
                        <h3>Lunch</h3>
                        <div className="flex justify-center flex-wrap gap-3">
                           {dayList[date.day][0].map((h, index) => (
                              <span
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
               <form
                  onSubmit={handleCustomerSubmit}
                  className="flex flex-col items-center"
               >
                  <label htmlFor="customers">Nombre de personnes</label>
                  <input
                     type="number"
                     id="customers"
                     name="customers"
                     min={1}
                     max={10}
                     required
                  />
                  <button type="submit">Ok</button>
               </form>
            ) : !tableId ? (
               <>
                  {tablesList &&
                     tablesList.map((table, index) => {
                        if (table.size > customerNbr) {
                           return (
                              <div
                                 key={index}
                                 onClick={() => setTableId(table.id)}
                              >
                                 <p>{table.name}</p>
                                 <p>{table.size}</p>
                              </div>
                           );
                        }
                     })}
               </>
            ) : (
               <div className="flex flex-col gap-5">
                  <h2>Résumé</h2>
                  <div>Date : {formatDate(date.date)}</div>
                  <div>Heure : {formatTime(hour / 3600000)}</div>
                  <div>Nbr : {customerNbr}</div>
                  <div>Table : {tableId}</div>
                  <button onClick={handleSubmit}>Valider</button>
               </div>
            )}
         </div>
      </div>
   );
};

export default User;
