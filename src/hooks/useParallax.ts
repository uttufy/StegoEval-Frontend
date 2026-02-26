"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ParallaxTransform {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

const INTENSITY = 20;

export function useParallax(intensity: number = INTENSITY) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<ParallaxTransform>({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const x = -(deltaX / rect.width) * intensity;
    const y = -(deltaY / rect.height) * intensity;
    const rotateY = (deltaX / rect.width) * 3;
    const rotateX = -(deltaY / rect.height) * 3;

    setTransform({ x, y, rotateX, rotateY });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove as EventListener);
    element.addEventListener("mouseleave", handleMouseLeave as EventListener);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove as EventListener);
      element.removeEventListener("mouseleave", handleMouseLeave as EventListener);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, transform };
}

export function useMagneticHover<T extends HTMLElement = HTMLElement>(strength: number = 8) {
  const ref = useRef<T>(null);
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const x = (deltaX / rect.width) * strength;
    const y = (deltaY / rect.height) * strength;

    setMagnetic({ x, y });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setMagnetic({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove as EventListener);
    element.addEventListener("mouseleave", handleMouseLeave as EventListener);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove as EventListener);
      element.removeEventListener("mouseleave", handleMouseLeave as EventListener);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, magnetic };
}
