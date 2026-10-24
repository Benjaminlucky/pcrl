// Card for one blog post (used on /blog and the "Latest posts" section).
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDate } from "../../cms/content";

const MotionArticle = motion.article;

export default function PostCard({ post, index = 0 }) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-gray-100">
        {post.coverImage?.url ? (
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-900 to-black" />
        )}
      </Link>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <span className="text-sm text-primary-500 font-medium">{formatDate(post.publishedAt)}</span>
        <h3 className="text-xl font-bold text-gray-900 leading-snug">
          <Link to={`/blog/${post.slug}`} className="hover:text-primary-500 transition-colors">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="text-gray-600 leading-relaxed line-clamp-3">{post.excerpt}</p>}
        <Link
          to={`/blog/${post.slug}`}
          className="mt-auto pt-2 font-semibold text-primary-500 hover:text-primary-700 transition-colors"
        >
          Read more →
        </Link>
      </div>
    </MotionArticle>
  );
}
