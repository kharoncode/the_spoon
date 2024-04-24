import { useEffect, useState } from 'react';

type fetchOption = {
   method?: string;
   headers?: {
      [key: string]: string;
   };
   body?: string;
};

interface FetchData<T> {
   data: T | null;
   isLoading: boolean;
   error: Error | null;
}

export default function useFetch<T>(
   url: string,
   option?: fetchOption
): FetchData<T> {
   const [data, setData] = useState<T | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(url, option);
            if (!response.ok) {
               const message: { error: { name: string; message: string } } =
                  await response.json();
               throw new Error(
                  `${message.error.name} : ${message.error.message}`
               );
            }
            const jsonData = await response.json();
            setData(jsonData as T);
            setError(null);
         } catch (error) {
            if (error instanceof Error) {
               console.error('Fetch error:', error);
               setError(error);
            } else {
               console.error('An unknown error has occurred:', error);
               setError(new Error('An unknown error has occurred !'));
            }
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
      /* eslint-disable */
   }, [url]);
   /* eslint-enable */

   return { data, isLoading, error };
}
