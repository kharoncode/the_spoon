'use client';
import React, { useState } from 'react';
import MultiRangeSlider from 'multi-range-slider-react';

type ChangeResult = {
   min: number;
   max: number;
   minValue: number;
   maxValue: number;
};

type Props = {
   day_time: 'lunch' | 'diner';
   start_time: number;
   end_time: number;
   content: string;
};

const OpeningTimeSetting = ({
   day_time,
   start_time,
   end_time,
   content,
}: Props) => {
   const day_time_list = {
      lunch: {
         min: 10,
         max: 16,
         list: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      },
      diner: {
         min: 18,
         max: 24,
         list: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'],
      },
   };
   const [minValue, set_minValue] = useState(start_time);
   const [maxValue, set_maxValue] = useState(end_time);

   const formatTime = (time: number) => {
      const timeList = time.toString().split('.');
      return `${timeList[0] != '24' ? timeList[0] : '00'}:${
         timeList[1] ? Number(`0.${timeList[1]}`) * 60 : '00'
      }`;
   };

   const handleInput = (e: ChangeResult) => {
      set_minValue(e.minValue);
      set_maxValue(e.maxValue);
   };

   const { min, max } = day_time_list[day_time];

   return (
      <div className="w-96">
         <MultiRangeSlider
            min={min}
            max={max}
            minValue={start_time}
            maxValue={end_time}
            step={0.25}
            stepOnly={true}
            labels={day_time_list[day_time].list}
            disabled={content === 'Closed' ? true : false}
            onChange={(e: ChangeResult) => handleInput(e)}
         />
         <p>
            Min : {formatTime(minValue)} / Max : {formatTime(maxValue)}
         </p>
      </div>
   );
};

export default OpeningTimeSetting;
