export default function PageHero({
  eyebrow,
  title,
  description,
}: Readonly<{ eyebrow: string; title: string; description?: string }>) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-fg text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted text-pretty">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
