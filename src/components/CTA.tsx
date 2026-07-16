import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-bg-light">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
          开始排版
        </h2>
        <p className="text-muted-foreground text-base mb-8">立享智能排版体验</p>
        <Link
          href="/doc/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
        >
          开始排版
          <i className="fas fa-arrow-right text-sm" />
        </Link>
      </div>
    </section>
  );
}
