import "./globals.css";

export const metadata = {
  title: "NanoFrontier · SpaceX + xAI Frontier Token",
  description: "Register your interest in the SpaceX + xAI Frontier Token. Pre-IPO Series.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
