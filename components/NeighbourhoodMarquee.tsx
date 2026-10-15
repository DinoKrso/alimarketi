import { stores } from "@/data/stores";

export function NeighbourhoodMarquee() {
  const labels = stores.map((store) => store.marquee);
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            aria-label={copy === 0 ? "Mjesta u kojima smo" : undefined}
            className="flex"
          >
            {labels.map((label) => (
              <li
                key={`${copy}-${label}`}
                className="flex items-center px-5 font-display text-lg font-semibold whitespace-nowrap text-paper/70"
              >
                {label}
                <span aria-hidden className="ml-10 h-1.5 w-1.5 rounded-full bg-brand" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
