'use client';
import Booking_CustomersNbr from '@/components/booking_components/Booking_CustomersNbr';
import Booking_Day from '@/components/booking_components/Booking_Day';
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
   bookings: booking[];
   bookings_list: number[];
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

const deleteBookingByDate = (
   date?: selectedDate,
   hour?: number,
   tableInfo?: { size: number; id: number },
   setDate?: React.Dispatch<React.SetStateAction<selectedDate | undefined>>,
   setHour?: React.Dispatch<React.SetStateAction<number | undefined>>,
   setcustomerNbr?: React.Dispatch<React.SetStateAction<number | undefined>>,
   setTableInfo?: React.Dispatch<
      React.SetStateAction<
         | {
              size: number;
              id: number;
           }
         | undefined
      >
   >
) => {
   if (date && hour && tableInfo) {
      fetch(
         `http://127.0.0.1:5000/bookings/canceled?date=${date.date + hour}`,
         {
            method: 'DELETE',
         }
      )
         .then((res) => res.json())
         .then((data) => {
            setDate && setDate(undefined);
            setHour && setHour(undefined);
            setcustomerNbr && setcustomerNbr(undefined);
            setTableInfo && setTableInfo(undefined);
         });
   } else {
      setDate && setDate(undefined);
      setHour && setHour(undefined);
      setcustomerNbr && setcustomerNbr(undefined);
      setTableInfo && setTableInfo(undefined);
   }
};

const User = ({ params }: { params: { id: string } }) => {
   const router = useRouter();
   const [disabledDaysList, setDisabledDaysList] = useState<number[]>([]);
   const { data: user, isLoading: iL_user } = useFetch<data_user>(
      `http://127.0.0.1:5000/user?id=${params.id}`
   );
   const [tablesList, setTablesList] = useState<tables_info>();

   useEffect(() => {
      fetch('http://127.0.0.1:5000/opening-times/open-days')
         .then((res) => res.json())
         .then((data) => setDisabledDaysList(data));
   }, []);

   const [date, setDate] = useState<selectedDate>();
   const [hour, setHour] = useState<number>();
   const [customerNbr, setcustomerNbr] = useState<number>();
   const [tableInfo, setTableInfo] = useState<{ size: number; id: number }>();
   const [alert, setAlert] = useState('');
   const [open, setOpen] = useState(false);

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

   const handleSubmit = (
      status: string,
      table_id_props: number,
      table_size_props: number
   ) => {
      if (params.id && date && hour && customerNbr && user) {
         const body = {
            customers_nbr: customerNbr,
            date: date.date + hour,
            status: status,
            table_id: table_id_props,
            table_size: table_size_props,
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
            });
      }
   };

   const handleSubmitV = (status: string) => {
      if (params.id && date && hour && customerNbr && tableInfo) {
         fetch(`http://127.0.0.1:5000/user?id=${params.id}`)
            .then((res) => res.json())
            .then((data: data_user) => {
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
                        table_id: tableInfo.id,
                        table_size: tableInfo.size,
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
      <div className="p-5 relative w-full flex flex-col items-center gap-8">
         <h1 className="text-center text-2xl font-bold">
            {!iL_user && user && user.user_id
               ? ` Welcome ${user.user_name}`
               : 'User not Found !'}
         </h1>
         {user && (
            <div className="w-96 flex flex-col border-2 rounded-xl items-center">
               <h2 className="p-2 text-center font-medium text-xl">
                  Faire une réservation :
               </h2>
               <div className="p-2 flex gap-1">
                  <div
                     className="p-2 font-bold bg-emerald-800 cursor-pointer rounded-tl-xl rounded-bl-xl text-white "
                     onClick={() => {
                        deleteBookingByDate(
                           date,
                           hour,
                           tableInfo,
                           setDate,
                           setHour,
                           setcustomerNbr,
                           setTableInfo
                        );
                     }}
                  >
                     Date
                  </div>
                  <div
                     className={`p-2 font-bold ${
                        !date && 'cursor-not-allowed'
                     } ${date && 'bg-emerald-800 text-white  cursor-pointer'}`}
                     onClick={() => {
                        deleteBookingByDate(
                           date,
                           hour,
                           tableInfo,
                           undefined,
                           setHour,
                           setcustomerNbr,
                           setTableInfo
                        );
                     }}
                  >
                     Heure
                  </div>
                  <div
                     className={`p-2 font-bold ${
                        !hour && 'cursor-not-allowed'
                     } ${hour && 'bg-emerald-800 text-white  cursor-pointer'}`}
                     onClick={() => {
                        deleteBookingByDate(
                           date,
                           hour,
                           tableInfo,
                           undefined,
                           undefined,
                           setcustomerNbr,
                           setTableInfo
                        );
                     }}
                  >
                     Nombre
                  </div>
                  <div
                     className={`p-2 font-bold ${
                        !customerNbr && 'cursor-not-allowed'
                     } ${
                        customerNbr &&
                        'bg-emerald-800 text-white  cursor-pointer'
                     }`}
                     onClick={() => {
                        deleteBookingByDate(
                           date,
                           hour,
                           tableInfo,
                           undefined,
                           undefined,
                           undefined,
                           setTableInfo
                        );
                     }}
                  >
                     Table
                  </div>
                  <div
                     className={`p-2 font-bold ${
                        !tableInfo && 'cursor-not-allowed'
                     } ${
                        tableInfo &&
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
                     {date.day && (
                        <Booking_Day
                           day={date.day}
                           date={date.date}
                           bookings_list={user.bookings_list}
                           setHour={setHour}
                        />
                     )}
                  </>
               ) : !customerNbr ? (
                  <Booking_CustomersNbr
                     date={date.date + hour}
                     setcustomerNbr={setcustomerNbr}
                  />
               ) : !tableInfo ? (
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
                                       handleSubmit(
                                          'pending',
                                          table.table_id,
                                          table.table_size
                                       );
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
                           <p>{tableInfo.id}</p>
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
         )}
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
                        tableInfo &&
                           handleSubmit(
                              'pending',
                              tableInfo.id,
                              tableInfo.size
                           );
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
                     {"La table n'est pas ou plus disponible."}
                  </h3>
                  <div
                     className="p-2 cursor-pointer border rounded-lg border-gray-300 hover:bg-gray-100 flex flex-col items-center"
                     onClick={() => {
                        setHour(undefined);
                        setcustomerNbr(undefined);
                        setTableInfo(undefined);
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
