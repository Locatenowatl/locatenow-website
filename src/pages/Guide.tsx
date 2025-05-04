import React, { useState, useRef, useEffect, useMemo } from "react";
import YouTube, { YouTubeProps, YouTubeEvent } from "react-youtube";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const videos = [
  { id: "A2bV0cklQXc", category: "Chess" },
  { id: "wqWlZTHKlv0", category: "Chess" },
  { id: "alv8TpIgsfU", category: "Chess" },
  { id: "Htq6-dwKuGI", category: "Chess" },
  { id: "QUFClyKKOe4", category: "Chess" },
  { id: "5t9fziJGCcg", category: "Chess" },
  { id: "dQmYR90xSxw", category: "Toast" },
  { id: "zhv1ogB5mqo", category: "Toast" },
  { id: "-1_rl5-zznY", category: "Toast" },
  { id: "ypA_KiitPpA", category: "Toast" },
  { id: "lX5nEzTUiXI", category: "Toast" },
  { id: "KWVe_p0kw0Q", category: "Toast" },
];

type Category = "Chess" | "Toast";

export function Guide({ onOpenModal }: { onOpenModal: () => void }) {
  const [filter, setFilter] = useState<Category>("Chess");
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const playersRef = useRef<Array<any | null>>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const filteredVideos = useMemo(
    () => videos.filter((v) => v.category === filter),
    [filter]
  );

  const [loadedStates, setLoadedStates] = useState<boolean[]>(
    filteredVideos.map(() => false)
  );

  useEffect(() => {
    setLoadedStates(filteredVideos.map(() => false));
  }, [filter]);

  const handlePlay = (idx: number) => {
    if (playingIndex !== null && playingIndex !== idx) {
      playersRef.current[playingIndex]?.pauseVideo();
    }
    setPlayingIndex(idx);
  };

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      if (playingIndex !== null) {
        playersRef.current[playingIndex]?.pauseVideo();
        setPlayingIndex(null);
      }
    };
    carouselApi.on("select", onSelect);
    return () => void carouselApi.off("select", onSelect);
  }, [carouselApi, playingIndex]);

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 0, controls: 1 },
  };

  const allLoaded = loadedStates.every((l) => l);

  return (
    <main className="bg-[#1A1A1A] text-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 space-y-8 relative">
        {/* Category filter buttons */}
        <div className="flex justify-center items-center space-x-4">
          {( ["Chess", "Toast"] as Category[] ).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded",
                filter === cat
                  ? "bg-[#B69D74] text-white"
                  : "bg-gray-700 text-gray-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel with spinner overlay */}
        <div className="relative">
          {!allLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A] z-10">
              <svg
                className="animate-spin h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          )}

          <section>
            <Carousel
              className="overflow-visible"
              opts={{ loop: true }}
              setApi={(api) => setCarouselApi(api)}
            >
              <CarouselPrevious className="text-white" />
              <CarouselContent className="flex space-x-4">
                {filteredVideos.map((video, idx) => (
                  <CarouselItem key={video.id} className="basis-1/3">
                    <div className="relative aspect-[9/16] w-full rounded-2xl shadow-lg overflow-hidden">
                      {!loadedStates[idx] && <Skeleton className="absolute inset-0" />}
                      <YouTube
                        videoId={video.id}
                        opts={opts}
                        onReady={(e: YouTubeEvent) => {
                          playersRef.current[idx] = e.target;
                          setLoadedStates((prev) => {
                            const next = [...prev];
                            next[idx] = true;
                            return next;
                          });
                        }}
                        className={cn(
                          "pointer-events-none w-full h-full transition-opacity duration-500",
                          loadedStates[idx] ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <button
                        onClick={() => {
                          carouselApi?.scrollTo(idx);
                          handlePlay(idx);
                          playersRef.current[idx]?.playVideo();
                        }}
                        className="absolute inset-0"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="text-white" />
            </Carousel>
          </section>
        </div>
      </div>
    </main>
  );
}
