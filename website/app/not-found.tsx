import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-container">
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>Let’s head back home.</h1>
      <p>This page could not be found.</p>
      <Link href="/" className="button primary">
        Back to our community
      </Link>
    </div>
  );
}
