"use client";

import { useCallback, useEffect } from "react";

let observer = null;

function getObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
  }
  return observer;
}

function observe(node) {
  const io = getObserver();
  if (!io) {
    node.classList.add("is-revealed");
    return;
  }
  io.observe(node);
}

export function useRevealRef() {
  return useCallback((node) => {
    if (!node || node.classList.contains("is-revealed")) return;
    observe(node);
  }, []);
}

export function useReveal() {
  useEffect(() => {
    const scan = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-revealed)")
        .forEach((node) => observe(node));
    };
    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => mutation.disconnect();
  }, []);
}
