import GrowIndexToolkitCarousel from "./GrowIndexToolkitCarousel";

export default function GrowIndexContent() {
  return (
    <>
      <h1 className="heading-xl mb-6">GROW</h1>
      <p className="body-lg mb-6">
        Grassroots Resources for Organizing &amp; Winning.
      </p>
      <p className="body-md mb-6">
        TX*SPARK toolkits offer customizable tools and resources based on a
        framework aligned with electoral and legislative calendars and focused
        on helping neighbors take meaningful action year-round.
      </p>
      <p className="body-sm text-secondary mb-6 max-w-prose border-l-2 border-spark-blue/35 pl-4">
        These packets build on each other—work through them in order for the
        clearest path from precinct knowledge to turnout and follow-up.
      </p>
      <div className="mt-14">
        <GrowIndexToolkitCarousel />
      </div>
    </>
  );
}
