export default function InfographicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide the top nav on the standalone infographic page */}
      <style>{`nav { display: none !important; }`}</style>
      {children}
    </>
  );
}
