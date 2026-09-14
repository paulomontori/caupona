export default function UnauthorizedPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Acesso não liberado</h1>
      <p className="text-sm text-zinc-600">
        Seu e-mail ainda não está na lista de acesso do Caupona. Peça pro Paulo te
        adicionar.
      </p>
    </div>
  );
}
