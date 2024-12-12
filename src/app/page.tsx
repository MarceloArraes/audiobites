// import Link from "next/link";

// import { LatestPost } from "@/app/_components/post";
import { HydrateClient } from "@/trpc/server";
import { SurveyComponent2 } from "@/components/Survey2";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <SurveyComponent2 />
      </main>
    </HydrateClient>
  );
}
