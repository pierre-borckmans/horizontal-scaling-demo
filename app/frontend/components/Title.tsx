import Rails from "../public/rails.svg";

export default function Title() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="absolute right-[18px] top-[18px] flex">
        <img src="/logo-dark.svg" width={36} />
      </div>

      <h1 className="flex w-full flex-col items-center justify-center gap-0 tracking-tight text-white">
        <span className="text-2xl font-extrabold text-[#4f98c4] lg:text-3xl">
          Horizontal Scaling
        </span>
      </h1>
    </div>
  );
}
