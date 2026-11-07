import { cn, hashString } from "@/lib/utils";

export function ProductMedia({
  image,
  src,
  alt = "Trang phục",
  ratio = "3/4",
  className,
  overlay = false,
  label,
}) {
  const rawSrc =
    typeof image === "string"
      ? image
      : image?.image_url || image?.src || image?.url || src;
  const imgObj =
    typeof image === "object" && image !== null
      ? { ...image, src: rawSrc || image.src }
      : rawSrc
      ? { src: rawSrc, alt }
      : null;
  const darkTone = imgObj?.tone?.[0] || "#6d4a44";
  const lightTone = imgObj?.tone?.[1] || "#efe6da";
  const motif = imgObj?.motif || "portrait";
  const seed = hashString(imgObj?.id || "media-default");
  const drift = (seed % 18) - 9;

  const ratioClass = {
    "3/4": "aspect-[3/4]",
    "4/5": "aspect-[4/5]",
    "1/1": "aspect-square",
    "16/9": "aspect-[16/9]",
    "5/7": "aspect-[5/7]",
  }[ratio] || "aspect-[3/4]";

  if (imgObj?.src) {
    return (
      <div className={cn("media-zoom relative overflow-hidden", ratioClass, className)}>
        <img
          src={imgObj.src}
          alt={imgObj.alt || alt}
          className="media-inner absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {overlay && <span className="absolute inset-0 bg-ink/15" />}
        {label && (
          <span className="eyebrow absolute bottom-3 left-3 bg-surface/85 px-2 py-1 text-ink">{label}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("media-zoom relative overflow-hidden", ratioClass, className)}
      role="img"
      aria-label={imgObj?.alt || alt}
    >
      <div
        className="media-inner absolute inset-0"
        style={{ background: `linear-gradient(168deg, ${lightTone} 0%, ${mix(lightTone, darkTone, 0.28)} 58%, ${mix(lightTone, darkTone, 0.5)} 100%)` }}
      >
        <svg
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          {renderMotif(motif, drift, darkTone, lightTone)}
        </svg>
      </div>

      <span
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 0 0, rgba(0,0,0,0.5) 0, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 2px)",
          backgroundSize: "3px 3px",
        }}
      />
      {overlay && <span className="pointer-events-none absolute inset-0 bg-ink/15" />}
      {label && (
        <span className="eyebrow absolute bottom-3 left-3 bg-surface/85 px-2 py-1 text-ink">{label}</span>
      )}
    </div>
  );
}

function renderMotif(motif, drift, dark, light) {
  switch (motif) {
    case "portrait":
      return (
        <>
          <circle cx={212 + drift} cy="104" r="78" fill={light} fillOpacity="0.55" />
          <rect x="0" y="300" width="300" height="100" fill={dark} opacity="0.12" />
          <path
            d={`M${125 + drift} 106 C ${122 + drift} 138, ${131 + drift} 158, ${133 + drift} 176 C ${135 + drift} 210, ${118 + drift} 262, ${106 + drift} 302 L${194 + drift} 302 C ${182 + drift} 262, ${165 + drift} 210, ${167 + drift} 176 C ${169 + drift} 158, ${178 + drift} 138, ${175 + drift} 106 C ${167 + drift} 96, ${159 + drift} 92, ${150 + drift} 92 C ${141 + drift} 92, ${133 + drift} 96, ${125 + drift} 106 Z`}
            fill={dark}
            fillOpacity="0.82"
          />
          <path d={`M${150 + drift} 92 V 300`} stroke={light} strokeOpacity="0.24" strokeWidth="1" fill="none" />
          <path d={`M${134 + drift} 98 C ${142 + drift} 112, ${158 + drift} 112, ${166 + drift} 98`} stroke={light} strokeOpacity="0.4" fill="none" />
          <path d="M20 302 H 280" stroke={light} strokeOpacity="0.3" />
        </>
      );
    case "drape":
      return (
        <>
          <path
            d={`M-20 ${40 + drift} C 90 ${120 + drift}, 120 ${210 + drift}, 60 420 L 320 420 L 320 0 Z`}
            fill={dark}
            fillOpacity="0.78"
          />
          <path
            d={`M-20 ${130 + drift} C 110 ${190 + drift}, 150 ${280 + drift}, 110 420`}
            stroke={light}
            strokeOpacity="0.35"
            strokeWidth="1.25"
            fill="none"
          />
          <path
            d={`M-20 ${196 + drift} C 130 ${250 + drift}, 180 ${330 + drift}, 156 420`}
            stroke={light}
            strokeOpacity="0.22"
            strokeWidth="1.25"
            fill="none"
          />
          <circle cx="52" cy="52" r="34" fill={light} fillOpacity="0.55" />
        </>
      );
    case "detail":
      return (
        <>
          <circle cx={170 + drift} cy="196" r="150" fill={dark} fillOpacity="0.8" />
          <circle cx={170 + drift} cy="196" r="104" fill="none" stroke={light} strokeOpacity="0.3" />
          <circle cx={170 + drift} cy="196" r="62" fill="none" stroke={light} strokeOpacity="0.22" />
          <path d={`M20 ${300 + drift / 2} H 280`} stroke={light} strokeOpacity="0.28" />
        </>
      );
    case "runway":
      return (
        <>
          <rect x="0" y="0" width="300" height="400" fill="none" />
          <rect x={106 + drift} y="42" width="88" height="250" fill={dark} fillOpacity="0.82" />
          <ellipse cx={150 + drift} cy="312" rx="96" ry="16" fill={dark} opacity="0.16" />
          <path d={`M${106 + drift} 292 L ${60 + drift} 400 M${194 + drift} 292 L ${240 + drift} 400`} stroke={light} strokeOpacity="0.3" />
          <rect x="0" y="330" width="300" height="70" fill={dark} opacity="0.08" />
        </>
      );
    case "still-life":
    default:
      return (
        <>
          <rect x="0" y="250" width="300" height="150" fill={dark} opacity="0.12" />
          <rect x={64 + drift} y="128" width="120" height="124" fill={dark} fillOpacity="0.82" />
          <circle cx={206 + drift} cy="198" r="54" fill={dark} opacity="0.55" />
          <path d={`M${64 + drift} 252 H ${262 + drift}`} stroke={light} strokeOpacity="0.35" />
          <circle cx="70" cy="74" r="26" fill={light} fillOpacity="0.55" />
        </>
      );
  }
}

function mix(a, b, amount) {
  const pa = parse(a);
  const pb = parse(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * amount));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function parse(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}
