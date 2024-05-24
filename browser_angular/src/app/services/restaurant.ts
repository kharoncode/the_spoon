export type Opening = {
   [key: string]: [
      {
         content: string;
         day_time: string;
         end_time: number;
         id: number;
         start_time: number;
      },
      {
         content: string;
         day_time: string;
         end_time: number;
         id: number;
         start_time: number;
      }
   ];
};

export type Restaurant = {
   address: string;
   cuisine: string;
   id: number;
   name: string;
   phone: number;
};
