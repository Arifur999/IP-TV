export default function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" style={{ animationDuration: "1s" }}></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}></div>
        <div className="absolute inset-4 rounded-full border-b-2 border-cyan-300 animate-spin" style={{ animationDuration: "2s" }}></div>
      </div>
    </div>
  );
}
