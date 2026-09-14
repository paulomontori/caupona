import RestaurantForm from "@/components/RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Adicionar restaurante</h1>
      <RestaurantForm />
    </div>
  );
}
