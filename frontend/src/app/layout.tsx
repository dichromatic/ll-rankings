import { Shell } from "@/components/layout/Shell";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {/* We wrap everything in a "Shell" to manage sidebars/nav once */}
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}