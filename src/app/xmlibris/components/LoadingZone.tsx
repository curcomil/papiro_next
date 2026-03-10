type FetchState = "loading" | "success" | "error";

export function LoadingZone({
  children,
  state,
  error,
  minHeight = "h-32",
}: {
  children: React.ReactNode;
  state: FetchState;
  error?: string;
  minHeight?: string;
}) {
  if (state === "loading") {
    return (
      <div className={`flex items-center justify-center ${minHeight} w-full`}>
        <span className="loading loading-ring loading-md text-primary" />
      </div>
    );
  }
  if (state === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 ${minHeight}`}
      >
        <p className="text-error font-semibold text-xs">
          Error al cargar datos
        </p>
        {error && <p className="text-xs text-base-content/50">{error}</p>}
        <button
          onClick={() => window.location.reload()}
          className="btn btn-xs btn-soft btn-warning"
        >
          Reintentar
        </button>
      </div>
    );
  }
  return <>{children}</>;
}
