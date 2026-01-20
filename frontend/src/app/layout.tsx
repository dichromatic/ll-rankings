import { Shell } from "@/components/layout/Shell";
import Providers from "./providers"; // Import the provider
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {/* The Provider must wrap the Shell so hooks inside the shell work */}
        <Providers>
          <Shell>
            {children}
          </Shell>
        </Providers>
      </body>
    </html>
  );
}