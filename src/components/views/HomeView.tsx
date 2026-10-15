"use client";

import {
  ApplyBand, Beyond, Editions, Faculty, Final, Hero, Lounge, Marquee, Masterclass, Passes, Review, Statement, Tiers, Tracks, Venue, WhatsNew,
} from "../sections";

/** The home page, top to bottom. */
export function HomeView() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <WhatsNew />
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
