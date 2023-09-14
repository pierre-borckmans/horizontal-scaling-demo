import Rails from "../public/rails.svg";

export default function Title() {
  return (
    <div className="mb-6 flex items-center gap-8">
      <div className="relative flex">
        <img
          src="/logo-dark.svg"
          width={44}
          className="mr-1 animate-pulse blur-[0px]"
        />
      </div>

      <h1 className="flex flex-col items-center gap-0 font-extrabold tracking-tight text-white">
        <span className="text-2xl text-[#4f98c4]">Horizontal Scaling</span>
        <div className="relative flex">
          <span className="absolute text-lg text-[#3e7698]">
            Distributed workload
          </span>
          <span className="animate-pulse text-lg text-white/50 blur-[14px]">
            Distributed workload
          </span>
        </div>
      </h1>

      <div className="relative ml-[-8px] mt-2 flex text-white/60">
        <Rails
          height={70}
          className="absolute left-0 top-0 scale-110 animate-pulse blur-[8px]"
        />
        <Rails height={70} />
      </div>
    </div>
  );
}
