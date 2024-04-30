'use client';
import { Modal } from '@/components/Modal';
import { formatTime } from '@/components/openingDayCard/OpeningDayCard';
import useFetch from '@/utils/useFetch';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type data_user = {
   user_id: number;
   user_name: string;
};

type booking = {
   booking_id: number;
   current_date: string;
   customers_nbr: number;
   date: number;
   status: string;
   table_id: number;
};

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
}[];

type selectedDate = { date: number; day: number };

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
   const router = useRouter();
   const [dayList, setDayList] = useState<{
      [key: number]: [number[], number[]];
   }>();
   const [disabledDaysList, setDisabledDaysList] = useState<number[]>([]);
   const { data: user, isLoading: iL_user } = useFetch<data_user>(
      `http://127.0.0.1:5000/user?id=${params.id}`
   );
   const [tablesList, setTablesList] = useState<tables_info>();

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
   const [alert, setAlert] = useState('');
   const [open, setOpen] = useState(false);

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
      if (params.id && date && hour && customerNbr && table_id_props && user) {
         const body = {
            customers_nbr: customerNbr,
            date: date.date + hour,
            status: status,
            table_id: table_id_props,
            user_id: params.id,
            user_name: user.user_name,
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
               if (data.status === 'time_out') {
                  setAlert(data.status);
                  setOpen(true);
               } else if (data.status === 'invalid') {
                  setAlert(data.status);
                  setOpen(true);
               }
               setResult(data.message);
            });
      }
   };

   const handleSubmitV = (status: string) => {
      if (params.id && date && hour && customerNbr && tableId) {
         fetch(`http://127.0.0.1:5000/user?id=${params.id}`)
            .then((res) => res.json())
            .then((data: { bookings: booking[] }) => {
               if (data.bookings) {
                  const booking = data.bookings.find(
                     (el) =>
                        el.status === 'pending' && el.date === date.date + hour
                  );
                  if (booking) {
                     const body = {
                        id: booking.booking_id,
                        customers_nbr: customerNbr,
                        date: date.date + hour,
                        status: status,
                        table_id: tableId,
                        user_id: params.id,
                     };

                     fetch('http://127.0.0.1:5000/bookings', {
                        method: 'PUT',
                        headers: {
                           'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                     })
                        .then((res) => res.json())
                        .then((data) => {
                           setResult(data.message);
                           setOpen(true);
                        });
                  }
               }
            });
      }
   };

   const isDisabledDay = (date: Date, disabledDays: number[]) => {
      const day = date.getDay();
      return !disabledDays.includes(day);
   };

   return (
      <div className="relative w-full flex flex-col items-center gap-8">
         <h1 className="text-center text-xl text-bold">
            {!iL_user && user && user.user_id
               ? ` Welcome User#${user.user_id} ${user.user_name}`
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
                  {date.day && dayList && (
                     <div className="p-5 flex flex-col gap-3">
                        {dayList[date.day][0].length > 0 && (
                           <>
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
                           </>
                        )}
                        {dayList[date.day][1].length > 0 && (
                           <>
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
                           </>
                        )}
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
                     tablesList.map((table, index) => {
                        if (
                           table.table_size < customerNbr ||
                           table.bookings.length > 0
                        ) {
                           return (
                              <div
                                 className={`p-2  border rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed opacity-60 flex flex-col items-center`}
                                 key={index}
                              >
                                 <p>{table.table_name}</p>
                                 <p>{table.table_size} Places</p>
                              </div>
                           );
                        } else {
                           return (
                              <div
                                 className={`p-2  border rounded-lg border-gray-300 hover:bg-gray-100 cursor-pointer flex flex-col items-center`}
                                 key={index}
                                 onClick={() => {
                                    handleSubmit('pending', table.table_id);
                                    setTableId(table.table_id);
                                 }}
                              >
                                 <p>{table.table_name}</p>
                                 <p>{table.table_size} Places</p>
                              </div>
                           );
                        }
                     })}
               </div>
            ) : (
               <div className="p-5 flex flex-col items-center gap-5">
                  <h3 className="text-center font-medium text-lg">Résumé</h3>
                  <div>
                     <div className="flex gap-2">
                        <h4 className="font-medium">Date : </h4>
                        <p>{formatDate(date.date)}</p>
                     </div>
                     <div className="flex gap-2">
                        <h4 className="font-medium">Heure : </h4>
                        <p>{formatTime(hour / 3600000)}</p>
                     </div>
                     <div className="flex gap-2">
                        <h4 className="font-medium">Nombre : </h4>
                        <p>{customerNbr}</p>
                     </div>
                     <div className="flex gap-2">
                        <h4 className="font-medium">Table : </h4>
                        <p>{tableId}</p>
                     </div>
                  </div>
                  <button
                     className="p-2 bg-gray-100 font-bold cursor-pointer border rounded-lg border-gray-300 hover:bg-emerald-800 hover:text-white flex flex-col items-center"
                     onClick={() => {
                        handleSubmitV('validate');
                        setOpen(true);
                     }}
                  >
                     Valider
                  </button>
               </div>
            )}
         </div>
         {result && <p>{result}</p>}
         <div className="absolute"></div>
         <Modal open={open}>
            {alert === 'time_out' ? (
               <div className="flex flex-col items-center gap-4">
                  <h3 className="text-center font-medium text-lg">
                     Êtes vous toujours là ?
                  </h3>
                  <div
                     className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 flex flex-col items-center"
                     onClick={() => {
                        handleSubmit('pending', tableId);
                        setOpen(false);
                        setAlert('');
                     }}
                  >
                     Oui
                  </div>
                  <div
                     className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 flex flex-col items-center"
                     onClick={() => router.replace(`/`)}
                  >
                     Non
                  </div>
               </div>
            ) : alert === 'invalid' ? (
               <div className="flex flex-col items-center gap-4">
                  <h3 className="text-center font-medium text-lg">
                     Vous avez déjà réserver une autre table à plus ou moins
                     90min
                  </h3>
                  <div
                     className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 flex flex-col items-center"
                     onClick={() => {
                        setHour(undefined);
                        setcustomerNbr(undefined);
                        setTableId(undefined);
                        setOpen(false);
                        setAlert('');
                     }}
                  >
                     {"Modifier l'heure"}
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center gap-4">
                  <h3 className="text-center font-medium text-lg">Merci !</h3>
                  <p>Ta réservation a bien été prise en compte :D</p>
                  <div
                     className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 flex flex-col items-center"
                     onClick={() => {
                        router.replace(`/`);
                     }}
                  >
                     Retour
                  </div>
               </div>
            )}
         </Modal>
      </div>
   );
};

export default User;
