import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { usePlayerAudio } from "../../utils";

export const PlayerSeek: FC = () => {
  const { rawAudio } = usePlayerAudio();
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const queuedScroll = useRef(0);
  const sliderRef = useRef<HTMLDivElement>();

  useEffect(() => {
    let currentFrameHandle: number;
    const frameHandler = () => {
      if (!rawAudio) {
        setProgress(undefined);
        return;
      }

      const currentTicks = rawAudio.seek();
      if (typeof currentTicks === "number") {
        setProgress(currentTicks);
      } else {
        setProgress(undefined);
      }

      currentFrameHandle = requestAnimationFrame(frameHandler);
    };

    currentFrameHandle = requestAnimationFrame(frameHandler);

    return () => cancelAnimationFrame(currentFrameHandle);
  }, [rawAudio]);

  useEffect(() => {
    if (!rawAudio) {
      setDuration(undefined);
      return;
    }

    const loadHandler = () => {
      setDuration(rawAudio.duration());
    };

    if (rawAudio.state() === "loading") {
      rawAudio.once("load", loadHandler);

      return () => {
        rawAudio.off("load", loadHandler);
      };
    } else {
      loadHandler();
    }
  }, [rawAudio]);

  useEffect(() => {
    const updateSeek = setInterval(() => {
      if (!rawAudio) return;

      if (queuedScroll.current !== 0) {
        rawAudio.seek((rawAudio.seek() as number) + queuedScroll.current);
        queuedScroll.current = 0;
      }
    }, 100);

    return () => clearInterval(updateSeek);
  }, [rawAudio]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (!rawAudio) return;

      const scrollAmount = Math.floor((e.deltaX + e.deltaY) / 20);
      queuedScroll.current += scrollAmount;
    },
    [rawAudio]
  );

  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener("wheel", handleScroll, { passive: false });

    return () => slider.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={sliderRef} style={{ width: "100%" }}>
      <Slider
        aria-label="Track progress"
        value={progress || 0}
        min={0}
        max={duration || 1}
        onChange={(seekTo) => rawAudio?.seek(seekTo)}
        isDisabled={!rawAudio}
        focusThumbOnChange={false}
        verticalAlign="middle"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        {rawAudio && <SliderThumb />}
      </Slider>
    </div>
  );
};
