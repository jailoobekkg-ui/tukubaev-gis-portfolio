import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container grid min-h-[70vh] place-items-center pt-24 text-center">
      <div>
        <p className="font-mono text-6xl font-bold text-accent">404</p>
        <p className="mt-4 text-lg">Page not found · Страница не найдена · Барак табылган жок</p>
        <Link href="/" className="btn-primary mt-8">
          Home
        </Link>
      </div>
    </div>
  );
}
