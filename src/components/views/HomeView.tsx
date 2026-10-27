"use client";

import {
  ApplyBand, Beyond, Editions, Faculty, Final, Hero, Lounge, Marquee, Masterclass, Passes, Poster, Review, Statement, Tiers, Tracks, Venue, WhatsNew,
} from "../sections";

/** The home page, top to bottom. */
export function HomeView() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <WhatsNew />
      <Poster />
      <Tracks />
      <Beyond />
      <Masterclass />
      <Faculty />
      <Review />
      <Editions />
      <Lounge />
      <ApplyBand />
      <Passes />
      <Tiers />
      <Venue />
      <Final />
    </>
  );
}
