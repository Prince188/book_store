import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} — Bookstore` : 'Bookstore — Discover Your Next Read'}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);

export default Seo;
