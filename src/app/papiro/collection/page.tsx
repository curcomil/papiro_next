import CollectionView from "./CollectionView";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ coleccion?: string }>;
}

export default async function CollectionPage({ searchParams }: PageProps) {
  const { coleccion } = await searchParams;

  if (!coleccion) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100 text-base-content">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <svg
            className="w-12 h-12 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h1 className="font-bold text-lg">Colección no especificada</h1>
          <p className="text-sm text-base-content/60 max-w-xs">
            La URL no contiene el parámetro{" "}
            <code className="font-mono bg-base-300 px-1 rounded">
              coleccion
            </code>
            . Accede desde el dashboard seleccionando una colección.
          </p>
          <Link
            href="/papiro/dashboard"
            className="btn btn-sm btn-primary mt-4"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <CollectionView coleccion={coleccion} />;
}
