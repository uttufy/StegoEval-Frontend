import { getAlgorithmByName, baseRankComparator, getLeaderboardEntriesSync } from "@/lib/leaderboard";
import { notFound } from "next/navigation";
import { TechniqueDetailClient } from "./TechniqueDetailClient";

interface TechniqueDetailPageProps {
  params: Promise<{ name: string }>;
}

export default async function TechniqueDetailPage({ params }: TechniqueDetailPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const entry = getAlgorithmByName(decodedName);

  if (!entry) {
    notFound();
  }

  // Calculate rank based on composite score
  const allEntries = getLeaderboardEntriesSync();
  const sortedEntries = [...allEntries].sort(baseRankComparator);
  const rank = sortedEntries.findIndex((e) => e.id === entry.id) + 1;

  return <TechniqueDetailClient entry={entry} rank={rank} />;
}
