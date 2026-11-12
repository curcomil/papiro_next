import ClasificarPanel from "@/modules/items/presentation/ClasificarPanel";
import VolverPendientes from "@/modules/pendientes/presentation/VolverPendientes";

interface PageProps {
  searchParams: Promise<{ item?: string }>;
}

export default async function ClasificarPage({ searchParams }: PageProps) {
  const { item } = await searchParams;

  return (
    <main className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10">
        <VolverPendientes className="-ml-3 mb-4" />

        {item ? (
          <ClasificarPanel internalId={item} />
        ) : (
          <p className="home text-sm font-light text-error">
            La URL debe incluir el parámetro <code>item</code> con el
            internal_id del item.
          </p>
        )}
      </div>
    </main>
  );
}
