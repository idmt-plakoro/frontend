export function getAvatarUrl(url: string | null | undefined): string {
  if (!url) return "/avatars/Pikachu.png";
  if (url.startsWith("https://plakoro.com/avatars/")) {
    const filename = url.replace("https://plakoro.com/avatars/", "");
    return `/avatars/${filename}`;
  }
  return url;
}
