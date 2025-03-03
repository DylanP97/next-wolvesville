export const divActionIcon =
  "aspect-square p-1 cursor-pointer flex justify-center items-center h-14";

export const imgActionIcon = "max-h-[20px] max-w-[20px] object-contain";

export const btnClassNames =
  "h-10 z-20 p-2 my-2 rounded-xl text-sm text-center flex justify-center items-center hover:scale-[105%] transition-all hover:cursor-pointer border-2 border-white";

export const btnPrimary =
  "bg-primary hover:bg-primary-focus text-primary-foreground";

export const btnSecondary =
  "bg-secondary hover:bg-secondary-focus text-secondary-foreground";

export const getBtnClassNames = (width) => {
  return `${btnClassNames} ${width}`;
};
