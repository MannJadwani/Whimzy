import { GameBuilderPage } from "@/features/gameBuilder/GameBuilderPage";

interface BuilderPageProps {
  params: {
    id: string;
  };
}

export default function BuilderWithId({ params }: BuilderPageProps) {
  return <GameBuilderPage gameId={params.id} />;
}