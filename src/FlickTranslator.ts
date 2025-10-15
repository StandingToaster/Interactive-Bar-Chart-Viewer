import {
  type FundamentalEvent,
  type EventTranslator,
  SKEvent,
} from "simplekit/canvas-mode";

const MIN_DISTANCE = 50;
const MAX_DURATION = 300;
const MAX_VERTICAL_RATIO = 0.4;

export function createFlickTranslator(): EventTranslator {
  let startPoint: { x: number; y: number } | null = null;
  let startTime: number | null = null;

  return {
    update(event: FundamentalEvent): SKEvent | undefined {

      if (event.type === "mousedown") {
        startPoint = { x: event.x ?? 0, y: event.y ?? 0 };
        startTime = event.timeStamp;
        return;
      }

      if (event.type === "mouseup" && startPoint && startTime != null) {
        const endPoint = { x: event.x ?? 0, y: event.y ?? 0 };
        const duration = event.timeStamp - startTime;
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;

        startPoint = null;
        startTime = null;

        if (duration > MAX_DURATION) return;
        if (Math.abs(dx) < MIN_DISTANCE) return;

        const verticalRatio = Math.abs(dy) / Math.abs(dx || 1); // avoid / 0
        if (
          !Number.isFinite(verticalRatio) ||
          verticalRatio > MAX_VERTICAL_RATIO
        )
          return;

        const type = dx < 0 ? "flickleft" : "flickright";
        return { type, timeStamp: event.timeStamp };
      }

      return;
    },
  };
}
