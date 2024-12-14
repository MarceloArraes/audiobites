// import Link from "next/link";

// import { LatestPost } from "@/app/_components/post";
import { HydrateClient } from "@/trpc/server";
import { SurveyComponent2 } from "@/components/Survey2";
import Image from "next/image";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="bg-custom min-h-screen flex-col items-center justify-center border-2 border-red-500 bg-contain">
        {/* <div className="grid h-full grid-cols-1">
          <div className="bg-city4 absolute left-0 top-0 -z-10 h-1/2 w-full rotate-180 bg-contain"></div>
          <div className="bg-city4 absolute bottom-0 left-0 -z-10 h-1/2 w-full rotate-90 bg-contain"></div>
          <div className="bg-city4 absolute bottom-52 left-0 -z-10 h-1/2 w-full bg-contain"></div>
        </div> */}
        <SurveyComponent2 />
      </main>
    </HydrateClient>
  );
}
