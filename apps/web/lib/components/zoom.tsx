"use client";

import { memo, PropsWithChildren } from "react";
import { Zoom as AwesomeZoom, ZoomProps } from "react-awesome-reveal";

export const Zoom = memo(
  ({ children, ...rest }: PropsWithChildren<ZoomProps>) => {
    return <AwesomeZoom {...rest}>{children}</AwesomeZoom>;
  },
);
