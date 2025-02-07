import Image from "next/image";

export default function Loading() {
  return (
    <div
      className={`flex flex-col gap-2 w-full h-full items-center justify-center`}
    >
      <p>Loading...</p>
      <div className="relative h-[60px] w-[60px]">
        <Image
          src="/images/loading-spinner.gif"
          alt="loader"
          fill
          unoptimized
        />
      </div>
    </div>
  );
}
