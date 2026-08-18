import { getGameProvider } from "@/lib/games";
import { CategoryBar } from "./CategoryBar";

export async function CategoryStrip() {
  const provider = getGameProvider();
  const categories = await provider.getCategories();

  return <CategoryBar categories={categories} />;
}
