'use client';
import React, { useState } from 'react';
import MultiRangeSlider from 'multi-range-slider-react';
import styles from './openingDayCard.module.css';

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

export const formatTime = (time: number) => {
   const timeList = time.toString().split('.');
   return `${timeList[0] != '24' ? timeList[0] : '00'}:${
      timeList[1] ? Number(`0.${timeList[1]}`) * 60 : '00'
   }`;
};

const OpeningDayCard = ({
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
   const [minValue, set_minValue] = useState(start_time / 60);
   const [maxValue, set_maxValue] = useState(end_time / 60);
   const [isOpen, setIsOpen] = useState<boolean>(
      content === 'closed' ? false : true
   );

   const handleInput = (e: ChangeResult) => {
      set_minValue(e.minValue);
      set_maxValue(e.maxValue);
      setBody((prev) => {
         prev[id] = {
            id: id,
            start_time: e.minValue * 60,
            end_time: e.maxValue * 60,
            content: isOpen
               ? `${formatTime(e.minValue)}-${formatTime(e.maxValue)}`
               : 'closed',
         };
         return prev;
      });
   };

   const toggle = () => {
      setIsOpen(!isOpen);
      setBody((prev) => {
         prev[id] = {
            id: id,
            start_time: minValue * 60,
            end_time: maxValue * 60,
            content: !isOpen
               ? `${formatTime(minValue)}-${formatTime(maxValue)}`
               : 'closed',
         };
         return prev;
      });
   };

   const { min, max } = day_time_list[day_time];

   return (
      <div className="w-full flex justify-center items-center gap-5">
         <div className="min-w-80 w-1/3 flex flex-col gap-2">
            <h4 className="capitalize">
               {day_time} : {formatTime(minValue)} - {formatTime(maxValue)}
            </h4>
            <MultiRangeSlider
               min={min}
               max={max}
               minValue={start_time / 60}
               maxValue={end_time / 60}
               step={0.25}
               stepOnly={true}
               disabled={!isOpen}
               labels={day_time_list[day_time].list}
               onChange={(e: ChangeResult) => handleInput(e)}
            />
         </div>
         <label className={styles.switch}>
            {isOpen ? (
               <input type="checkbox" defaultChecked onChange={toggle} />
            ) : (
               <input type="checkbox" onChange={toggle} />
            )}
            <span className={`${styles.slider} ${styles.round}`}></span>
         </label>
      </div>
   );
};

export default OpeningDayCard;
