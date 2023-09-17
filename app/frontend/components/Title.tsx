import Rails from "../public/rails.svg";

export default function Title() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="absolute right-[18px] top-[18px] flex">
        <img src="/logo-dark.svg" width={36} />
      </div>

      <h1 className="relative flex w-full flex-col items-center justify-center gap-0 tracking-tight text-white">
        <span className="absolute z-[0] text-2xl font-extrabold tracking-[2.4px] text-[#4f98c411] lg:text-3xl">
          Horizontal Scaling
        </span>
        <span className="absolute z-10 text-2xl font-extrabold tracking-[1.2px] text-[#4f98c422]  lg:text-3xl">
          Horizontal Scaling
        </span>
        <span className="absolute z-20 text-2xl font-extrabold tracking-[0.3px] text-[#4f98c433]  lg:text-3xl">
          Horizontal Scaling
        </span>
        <span className="z-30 text-2xl font-extrabold text-[#4f98c4] lg:text-3xl">
          Horizontal Scaling
        </span>
      </h1>
    </div>
  );
}
