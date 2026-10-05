import { ArrowRight } from "lucide-react";
import Reveal from "../../components/Reveal";

const BUSINESSES = [
  {
    title: "Software Services & AI Automation",
    text: "Innovative software solutions and AI automation to solve real world problems.",
    image: "/assets/software.jpg",
    imageAlt: "Software services and AI automation",
  },
  {
    title: "Travel Services Global",
    text: "Curated global travel experiences for individuals and businesses.",
    image: "/assets/travel.jpg",
    imageAlt: "Global travel services",
  },
  {
    title: "Digital Marketing & Content Creation",
    text: "Strategic digital marketing, branding and high quality content creation.",
    image: "/assets/digital-marketing.jpg",
    imageAlt: "Digital marketing and content creation",
  },
  {
    title: "Film Production",
    text: "Creative storytelling through film, media and visual production.",
    image: "/assets/film.jpg",
    imageAlt: "Film production",
  },
  {
    title: "Car Automotive",
    text: "Automotive solutions and services for a smarter, more connected future.",
    image: "/assets/car.jpg",
    imageAlt: "Car automotive services",
  },
  {
    title: "Mai International Children's Foundation",
    text: "Empowering children through education, care and opportunities.",
    image: "/assets/mai.jpg",
    imageAlt: "Mai International Children's Foundation",
  },
];

function BusinessRow({ hidden }) {
  return (
    <div className="flex gap-5 pr-5" aria-hidden={hidden || undefined}>
      {BUSINESSES.map((business) => (
        <article
          key={`${hidden ? "dup-" : ""}${business.title}`}
          className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl bg-deepnavy shadow-[0_12px_36px_rgba(3,20,38,0.18)] transition-colors duration-300 hover:border hover:border-gold/40 sm:w-[310px]"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={business.image}
              alt={hidden ? "" : business.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-serif text-base font-bold leading-snug text-gold">
              {business.title}
            </h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mutedwhite/70">
              {business.text}
            </p>
            <span className="mt-4 inline-flex justify-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-deepnavy">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
export default function Businesses() {
  return (
    <section aria-label="Our businesses" className="overflow-x-clip bg-[#FBF7EE] pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#A87B1F] sm:text-xs">
            Our Businesses
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-deepnavy sm:text-4xl">
            Diverse Industries. Greater Impact.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-deepnavy/70 sm:text-[15px]">
            We bring together multiple industries under one vision to create
            value, innovation and a better tomorrow.
          </p>
        </Reveal>

      </div>

      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-services-x flex w-max hover:[animation-play-state:paused]">
          <BusinessRow hidden={false} />
          <BusinessRow hidden />
        </div>
      </div>
    </section>
  );
}
