import { useRef, useEffect, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

interface ImageAssetProps extends Omit<ComponentPropsWithoutRef<"img">, "loading"> {
  src: string;
  alt: string;
  aspect?: "square" | "video" | "portrait" | "wide";
  animation?: "fade" | "scale" | "slide-up" | "none";
  animationDelay?: number;
}

const ASPECT_MAP = {
  square: "1 / 1",
  video: "16 / 9",
  portrait: "3 / 4",
  wide: "21 / 9",
} as const;

export default function ImageAsset({
  src,
  alt,
  aspect = "video",
  animation = "fade",
  animationDelay = 0,
  className = "",
  ...imgProps
}: ImageAssetProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = imgRef.current;
    if (!el || reducedMotion || animation === "none") {
      gsap.set(el, { opacity: 1, clearProps: "transform" });
      return;
    }

    const from: gsap.TweenVars = { opacity: 0 };
    if (animation === "scale") from.scale = 1.05;
    else if (animation === "slide-up") from.y = 20;

    gsap.set(el, from);

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: animationDelay,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [reducedMotion, animation, animationDelay]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`image-asset image-asset--${aspect} ${className}`}
      style={{ aspectRatio: ASPECT_MAP[aspect] }}
      {...imgProps}
    />
  );
}
