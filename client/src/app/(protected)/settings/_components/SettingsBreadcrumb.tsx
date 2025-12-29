import Link from "next/link";

interface SettingsBreadcrumbProps {
  currentPage: string;
}

export function SettingsBreadcrumb({ currentPage }: SettingsBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <span>/</span>
      <Link href="/settings/profile" className="hover:text-primary transition-colors">
        Settings
      </Link>
      <span>/</span>
      <span className="text-foreground">{currentPage}</span>
    </div>
  );
}
