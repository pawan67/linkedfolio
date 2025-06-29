import Home from "@/components/marketing";
import { db } from "@/drizzle/db/drizzle";
import { profiles } from "@/drizzle/db/schema";
import { count } from "drizzle-orm";

const HomePage = async () => {
  const profileCount = await db
    .select({
      count: count(),
    })
    .from(profiles);

  return <Home profileCount={profileCount[0].count} />;
};

export default HomePage;
