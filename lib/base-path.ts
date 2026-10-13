// Static assets need the deploy base path (e.g. "/designed-portfolio" on
// GitHub Pages). next/image and plain URLs don't add it automatically.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
