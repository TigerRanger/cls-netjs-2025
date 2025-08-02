import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: '404 | Page Not Found',
  description: 'The requested page could not be found.',
};
const NotFound = () => {
    return (
        <>
        <section className='error-page'>
            <div className="container">
          <div className="error-content">
            <h1 className="error-title ak-stroke-number color-white">404</h1>
            <h2 className="erro-sub-title">Sorry! The Page isn&#39;t Found Here</h2> {/* Escaped apostrophe */}
            <p className="erro-desp">
              Fortunately, since it is mainly a client-side issue, it is relatively
              easy for website owners to fix the 404 error. This article will
              explain the possible causes of error 404 and show four effective
              methods to resolve it.Fortunately, since it is mainly a client-side
              issue.
            </p>
            <div className="go-to-home">
              <Link href="/" className="common-btn">
                BACK TO HOME
              </Link>
            </div>
          </div>
          </div>
      </section>

      </>
    );
};
export default NotFound;
