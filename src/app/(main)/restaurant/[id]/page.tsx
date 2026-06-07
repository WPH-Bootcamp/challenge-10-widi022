import RestaurantDetail from "@/features/restaurant/RestaurantDetail";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RestaurantDetail id={id} />;
}
