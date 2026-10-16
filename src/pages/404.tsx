function PageNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600 font-mono">404</h1>
      <p className="text-slate-700 font-semibold text-lg mt-2">
        Page Not Found
      </p>
      <p className="text-slate-400 text-xs mt-1">
        The link you followed may be broken or the page has been removed.
      </p>
    </div>
  );
}

export default PageNotFound;
