"use client";

import { Editions, Faculty, Films, Final, Hero, Intro, Lounge, Marquee, Masterclass, Passes, Review, Tiers, Tracks, Venue, WhatsNew } from "../sections";

/** The home page, top to bottom, in the order of the DZAC 5 design. */
export function HomeView() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <WhatsNew />
      <Tracks />
      <Masterclass />
      <Faculty />
      <Review />
      <Editions />
      <Lounge />
      <Films />
      <Passes />
      <Tiers />
      <Venue />
      <Final />
    </>
  );
}
