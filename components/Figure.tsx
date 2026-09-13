import type { Media } from "@/lib/projects";

export default function Figure({ media }: { media: Media }) {
  return (
    <figure className="m-0">
      <div className="sketch overflow-hidden">
        {media.kind === "image" && (
          // Project media is user-supplied at arbitrary sizes; a plain img with
          // intrinsic dimensions reserves the right space without next/image
          // needing dangerouslyAllowSVG for the placeholder art.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.src}
            alt={media.alt}
            width={media.w}
            height={media.h}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        )}

        {media.kind === "video" && (
          <video
            src={media.src}
            poster={media.poster}
            controls
            playsInline
            preload="metadata"
            className="block h-auto w-full"
          />
        )}

        {media.kind === "embed" && (
          <div className="relative aspect-video">
            <iframe
              src={media.src}
              title={media.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        )}
      </div>

      {media.caption && (
        <figcaption className="mt-4 max-w-[34rem] text-[0.9rem] leading-[1.6] text-ink-faint">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}
