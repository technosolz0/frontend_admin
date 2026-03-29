declare module 'next/navigation' {
  import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

  export function useRouter(): {
    push(href: string, options?: NavigateOptions): void;
    replace(href: string, options?: NavigateOptions): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(href: string, options?: NavigateOptions): void;
  };

  export function useParams<T = Record<string, string | string[]>>(): T;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}
