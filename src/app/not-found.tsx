import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl font-bold gradient-text">404</h1>
        <p className="mt-4 font-heading text-xl text-brand-white">
          Страницата не е намерена
        </p>
        <p className="mt-2 text-brand-gray">
          Страницата, която търсите, не съществува или е преместена.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Начална страница
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
