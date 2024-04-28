'use client';
import React, { useState } from 'react';
import MultiRangeSlider from 'multi-range-slider-react';

type Opening = {
   id: number;
   start_time: number;
   end_time: number;
   content: string;
}[];

type ChangeResult = {
   min: number;
   max: number;
   minValue: number;
   maxValue: number;
};

type Props = {
   id: number;
   day_time: 'lunch' | 'dinner';
   start_time: number;
   end_time: number;
   content: string;
   setBody: React.Dispatch<React.SetStateAction<Opening>>;
};

const OpeningTimeSetting = ({
   id,
   day_time,
   start_time,
   end_time,
   content,
   setBody,
}: Props) => {
   const day_time_list = {
      lunch: {
         min: 10,
         max: 16,
         list: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      },
      dinner: {
         min: 18,
         max: 24,
         list: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'],
      },
   };
   const [minValue, set_minValue] = useState(start_time);
   const [maxValue, set_maxValue] = useState(end_time);
   const [isOpen, setIsOpen] = useState<boolean>(
      content === 'Closed' ? false : true
   );
   const [result, setResult] = useState({
      id: id,
      start_time: start_time,
      end_time: end_time,
      content: content,
   });

   const formatTime = (time: number) => {
      const timeList = time.toString().split('.');
      return `${timeList[0] != '24' ? timeList[0] : '00'}:${
         timeList[1] ? Number(`0.${timeList[1]}`) * 60 : '00'
      }`;
   };

   const handleInput = (e: ChangeResult) => {
      set_minValue(e.minValue);
      set_maxValue(e.maxValue);
      const req = {
         id: id,
         start_time: e.minValue * 60,
         end_time: e.maxValue * 60,
         content: `${formatTime(e.minValue)}-${formatTime(e.maxValue)}`,
      };
      setResult(req);
      setBody((prev) => {
         const temp = prev;
         temp[id] = req;
         return temp;
      });
   };

   const { min, max } = day_time_list[day_time];

   return (
      <div className="w-full flex justify-center gap-5">
         index = {id}
         <div className="min-w-80 w-1/3 flex flex-col gap-2">
            <h4 className="capitalize">
               {day_time} : {formatTime(minValue)} - {formatTime(maxValue)}
            </h4>
            <MultiRangeSlider
               min={min}
               max={max}
               minValue={start_time}
               maxValue={end_time}
               step={0.25}
               stepOnly={true}
               labels={day_time_list[day_time].list}
               disabled={!isOpen}
               onChange={(e: ChangeResult) => handleInput(e)}
            />
         </div>
         <button
            onClick={() => {
               setIsOpen((prev) => !prev);
               setBody((prev) => {
                  const temp = prev;
                  temp[id] = !isOpen
                     ? result
                     : {
                          id: id,
                          start_time: 0,
                          end_time: 0,
                          content: 'Closed',
                       };
                  return temp;
               });
            }}
         >
            {isOpen ? 'Ouvert' : 'Fermée'}
         </button>
      </div>
   );
};

export default OpeningTimeSetting;
