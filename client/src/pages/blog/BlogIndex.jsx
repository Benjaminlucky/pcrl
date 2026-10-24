// /blog — all published posts (optionally filtered by ?tag=).
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageSEO from "../../components/PageSEO";
import ContentHeader from "../../components/content/ContentHeader";
import PostCard from "../../components/content/PostCard";
import { fetchContent } from "../../cms/content";

const PAGE_SIZE = 9;

export default function BlogIndex() {
  const [params] = useSearchParams();
  const tag = params.get("tag") || "";
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("loading");

  // Reset when the tag filter changes.
  useEffect(() => {
    setPosts([]);
    setPage(1);
  }, [tag]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (tag) qs.set("tag", tag);
    fetchContent(`/blog?${qs}`).then(({ status: s, data }) => {
      if (cancelled) return;
      if (s === "ok") {
        setPosts((prev) => (page === 1 ? data.docs : [...prev, ...data.docs]));
        setPages(data.pages || 1);
      }
      setStatus(s);
    });
    return () => {
      cancelled = true;
    };
  }, [page, tag]);

  return (
    <>
      <PageSEO
        title={tag ? `Blog: ${tag}` : "Blog"}
        description="News, insights and stories from Platinum Cape Realtors Group — Nigeria's fast-growing realtor network."
        canonical="https://pcrginitiative.com/blog"
      />
      <ContentHeader
        eyebrow="PCRG Blog"
        title={tag ? `Posts tagged “${tag}”` : "News, Insights & Stories"}
        subtitle="Real estate know-how, market updates and stories from the PCRG community."
      >
        {tag && (
          <Link to="/blog" className="inline-block mt-6 text-sm text-gray-300 underline hover:text-white">
            Show all posts
          </Link>
        )}
      </ContentHeader>

      <section className="bg-gray-50 py-16 md:py-24 px-6 min-h-[40vh]">
        <div className="container mx-auto">
          {status === "error" && posts.length === 0 && (
            <p className="text-center text-gray-600">We couldn't load the blog right now. Please try again shortly.</p>
          )}
          {status === "ok" && posts.length === 0 && (
            <p className="text-center text-gray-600">No posts yet — check back soon.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i % PAGE_SIZE} />
            ))}
          </div>
          {status === "loading" && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
          {status !== "loading" && page < pages && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="px-8 py-3 rounded-md bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
              >
                Load more posts
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
