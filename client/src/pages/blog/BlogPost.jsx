// /blog/:slug — one published blog post.
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import PageSEO from "../../components/PageSEO";
import NotFound from "../../components/NotFound";
import ContentHeader from "../../components/content/ContentHeader";
import RichBody from "../../cms/RichBody";
import { fetchContent, formatDate } from "../../cms/content";

const SITE_URL = "https://pcrginitiative.com";

export default function BlogPost() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", post: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", post: null });
    fetchContent(`/blog/${encodeURIComponent(slug)}`).then(({ status, data }) => {
      if (!cancelled) setState({ status, post: data });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (state.status === "notfound") return <NotFound />;
  if (state.status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-700 text-lg">We couldn't load this post right now. Please try again shortly.</p>
        <Link to="/blog" className="text-primary-500 underline">
          Back to the blog
        </Link>
      </div>
    );
  }

  const post = state.post;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = post.seo?.description || post.excerpt || post.title;
  const image = post.seo?.ogImage || post.coverImage?.url;

  return (
    <>
      <PageSEO
        title={post.seo?.title || post.title}
        description={description}
        canonical={post.seo?.canonical || url}
        ogImage={image || undefined}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description,
          image: image || undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Organization", name: "Platinum Cape Realtors Group" },
          publisher: {
            "@type": "Organization",
            name: "Platinum Cape Realtors Group",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/pcrgLogo.svg` },
          },
          mainEntityOfPage: url,
        }}
      />
      <ContentHeader eyebrow={formatDate(post.publishedAt)} title={post.title} subtitle={post.excerpt}>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((t) => (
              <Link
                key={t}
                to={`/blog?tag=${encodeURIComponent(t)}`}
                className="text-xs uppercase tracking-wide bg-white/10 hover:bg-primary-500 rounded-full px-3 py-1 transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </ContentHeader>

      <article className="bg-white py-12 md:py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          {post.coverImage?.url && (
            <img
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              className="w-full rounded-2xl shadow-lg mb-10 -mt-20 md:-mt-24 relative"
            />
          )}
          <RichBody text={post.body} />
          <div className="mt-14 pt-8 border-t border-gray-200">
            <Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-primary-500 hover:text-primary-700">
              <FaArrowLeft /> All posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
