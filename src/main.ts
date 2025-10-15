import {
  startSimpleKit,
  setSKDrawCallback,
  setSKAnimationCallback,
  skTime,
  setSKEventListener,
  SKEvent,
  SKMouseEvent,
  SKKeyboardEvent,
  addSKEventTranslator,
} from "simplekit/canvas-mode";
import { Chart } from "./chart";
import { ButtonRow } from "./buttonRow";
import { datasets } from "./datasets";
import { createFlickTranslator } from "./FlickTranslator";
import { FlickFeedback } from "./flickFeedback";

addSKEventTranslator(createFlickTranslator());
const flickFeedback = new FlickFeedback();

const bottomHeight = 50;
const chart = new Chart({ bottomHeight });
const buttonRow = new ButtonRow({ height: bottomHeight });
let canvasWidth = 0;
let canvasHeight = 0;
let selectedButtonIndex = 0;
let hoverButtonIndex: number | null = null;
let hoverBarIndex: number | null = null;
let selectedBarIndex: number | null = null;
let shiftDown = false;


setSKAnimationCallback((time) => {
  buttonRow.updateAnimations(time);
  chart.updateAnimations(time);
  flickFeedback.update(time);
});

setSKEventListener((event: SKEvent) => {
  switch (event.type) {
    case "mousedown": {
      const { x, y } = event as SKMouseEvent;
      // button select
      const buttonHit = buttonRow.buttonHitTest(
        x,
        y,
        canvasWidth,
        canvasHeight
      );

      if (buttonHit !== null) {
        selectedButtonIndex = buttonHit;
        selectedBarIndex = null;
        buttonRow.startSelectionAnimation(buttonHit, skTime);
        chart.startBarAnimation(datasets[selectedButtonIndex], skTime);
      } else {
        selectedBarIndex = chart.barHitTest(x, y);
      }

      break;
    }
    case "mousemove": {
      const { x, y } = event as SKMouseEvent;
      // hover over button check
      const buttonHit = buttonRow.buttonHitTest(
        x,
        y,
        canvasWidth,
        canvasHeight
      );
      hoverButtonIndex = buttonHit;

      //hover over bar check
      hoverBarIndex = chart.barHitTest(x, y);
      break;
    }
    case "keydown": {
      const { key } = event as SKKeyboardEvent;
      if (key === "Shift") {
        shiftDown = true;
        break;
      }

      if (selectedBarIndex !== null) {
        const dataset = datasets[selectedButtonIndex];
        const step = shiftDown ? 10 : 1;
        if (key === "ArrowUp") {
          dataset.values[selectedBarIndex] = Math.min(
            100,
            dataset.values[selectedBarIndex] + step
          );
        } else if (key === "ArrowDown") {
          dataset.values[selectedBarIndex] = Math.max(
            0,
            dataset.values[selectedBarIndex] - step
          );
        }
      }
      break;
    }
    case "keyup": {
      const { key } = event as SKKeyboardEvent;
      if (key === "Shift") {
        shiftDown = false;
        break;
      }
      break;
    }
    case "flickright": {
      if (selectedButtonIndex < datasets.length - 1) {
        selectedButtonIndex++;
        selectedBarIndex = null;
        buttonRow.startSelectionAnimation(selectedButtonIndex, skTime);
        chart.startBarAnimation(datasets[selectedButtonIndex], skTime);
        flickFeedback.start("right", skTime);
      }
      break;
    }
    case "flickleft": {
      if (selectedButtonIndex > 0) {
        selectedButtonIndex--;
        selectedBarIndex = null;
        buttonRow.startSelectionAnimation(selectedButtonIndex, skTime);
        chart.startBarAnimation(datasets[selectedButtonIndex], skTime);
        flickFeedback.start("left", skTime);
      }
      break;
    }
  }
});

setSKDrawCallback((gc: CanvasRenderingContext2D) => {
  canvasWidth = gc.canvas.width;
  canvasHeight = gc.canvas.height;

  gc.clearRect(0, 0, canvasWidth, canvasHeight);

  chart.draw(
    gc,
    datasets[selectedButtonIndex],
    hoverBarIndex,
    selectedBarIndex
  );
  buttonRow.draw(gc, hoverButtonIndex);
  flickFeedback.draw(gc, canvasWidth, canvasHeight);
});

startSimpleKit();
