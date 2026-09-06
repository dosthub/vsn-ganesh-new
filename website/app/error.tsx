"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page-container">
      <h1>Unable to load this information</h1>
      <p>Please try again in a moment.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
