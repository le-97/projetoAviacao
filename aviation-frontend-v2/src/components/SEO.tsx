import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    structuredData?: object;
}

export const SEO = ({
    title = "Embraer Aviation Compliance Platform",
    description = "Advanced aviation compliance platform for Embraer aircraft. Ensure regulatory compliance with automated checks, real-time monitoring, and comprehensive reporting.",
    keywords = "aviation, compliance, Embraer, aircraft, regulatory, safety, certification",
    image = "/vite.svg",
    url = window.location.href,
    type = "website",
    structuredData,
}: SEOProps) => {
    const siteName = "Embraer Aviation Compliance Platform";
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

    return (
        <Helmet>
            {/* Basic meta tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Embraer Aviation Compliance Platform" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="en-US" />
            <meta name="revisit-after" content="7 days" />

            {/* Open Graph tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Aviation-specific meta tags */}
            <meta name="aviation:compliance" content="EASA, FAA, ANAC" />
            <meta name="aviation:aircraft" content="Embraer E-Jets, Phenom, Praetor" />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};