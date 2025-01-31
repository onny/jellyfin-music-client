import {
  IconButton,
  IconButtonProps,
  forwardRef,
  Button,
} from "@chakra-ui/react";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons";
import React from "react";

export interface TrackPlayButtonProps
  extends Omit<IconButtonProps, "aria-label"> {
  isCurrentTrack: boolean;
  isPlaying: boolean;
  "aria-label"?: string;
}

export const TrackPlayButton = forwardRef<
  TrackPlayButtonProps,
  typeof IconButton
>(({ isCurrentTrack, isPlaying, ...buttonProps }, ref) => {
  return (
    <IconButton
      ref={ref}
      variant="ghost"
      isRound
      aria-label={isCurrentTrack ? "Pause" : "Play"}
      icon={
        isCurrentTrack && isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />
      }
      {...buttonProps}
    />
  );
});

export interface TrackIndexPlayButtonProps extends TrackPlayButtonProps {
  index: number;
}

export const TrackIndexPlayButton = forwardRef<
  TrackIndexPlayButtonProps,
  typeof IconButton
>(({ index, isCurrentTrack, ...buttonProps }, ref) => {
  if (isCurrentTrack) {
    return (
      <TrackPlayButton
        ref={ref}
        isCurrentTrack={isCurrentTrack}
        {...buttonProps}
      />
    );
  } else {
    return (
      <Button
        ref={ref}
        variant="ghost"
        isRound
        aria-label="Play"
        {...buttonProps}
      >
        {index + 1}
      </Button>
    );
  }
});
