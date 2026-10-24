// src/cms/ActionLink.jsx
// A button whose destination is editable. With no `url` it renders exactly
// the original element (a plain/motion <button>); with a url it renders a
// router <Link> (internal "/…") or an <a> (external, mailto:, tel:, #…)
// carrying the same classes and motion props.
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export default function ActionLink({ url, motionProps, className = "", children, ...rest }) {
  const isMotion = !!motionProps;
  const extra = isMotion ? motionProps : {};

  if (url) {
    const cls = `inline-block ${className}`;
    if (url.startsWith("/")) {
      const C = isMotion ? MotionLink : Link;
      return (
        <C to={url} className={cls} {...extra} {...rest}>
          {children}
        </C>
      );
    }
    const external = /^https?:\/\//i.test(url);
    const C = isMotion ? motion.a : "a";
    return (
      <C
        href={url}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cls}
        {...extra}
        {...rest}
      >
        {children}
      </C>
    );
  }

  const C = isMotion ? motion.button : "button";
  return (
    <C className={className} {...extra} {...rest}>
      {children}
    </C>
  );
}
