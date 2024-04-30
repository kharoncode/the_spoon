type propsType = {
   open: boolean;
   children: string | JSX.Element;
};

export const Modal = (props: propsType) => {
   const { open, children } = props;

   return (
      <div
         className={`absolute ${
            open ? 'flex' : 'hidden'
         } justify-center top-0 left-0 w-full h-full backdrop-blur-sm`}
      >
         <div className="flex flex-col items-center justify-center gap-5 mt-auto p-8 w-4/5 h-fit border-4 border-purple-600 rounded-3xl bg-white">
            {children}
         </div>
      </div>
   );
};
