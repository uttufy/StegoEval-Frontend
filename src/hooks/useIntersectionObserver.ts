"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);
  const hasTriggered = useRef(false);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!hasTriggered.current || !triggerOnce) {
          setIsVisible(true);
          hasTriggered.current = true;
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    });
  }, [triggerOnce]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [observerCallback, threshold, rootMargin]);

  return { ref, isVisible };
}

export function useStaggeredIntersection<T extends HTMLElement = HTMLElement>(delay: number = 80) {
  const { ref, isVisible } = useIntersectionObserver<T>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, delay]);

  return { ref, show };
}
