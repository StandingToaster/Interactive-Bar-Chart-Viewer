import { Animator, easeOut } from "./animator";

const DURATION = 1000;
const START_OPACITY = 0.2;

export class FlickFeedback {
  private direction: "left" | "right" | null = null;
  private opacity = 0;
  private animator: Animator | null = null;

  start(direction: "left" | "right", startTime: number) {
    this.direction = direction;
    this.opacity = START_OPACITY;
    this.animator = new Animator(
      START_OPACITY,
      0,
      DURATION,
      (value) => {
        this.opacity = value;
      },
      easeOut
    );
    this.animator.start(startTime);
  }

  update(time: number) {
    if (!this.animator) return;
    this.animator.update(time);
    if (!this.animator.isRunning) {
      this.animator = null;
      this.direction = null;
      this.opacity = 0;
    }
  }

  draw(gc: CanvasRenderingContext2D, width: number, height: number) {
    if (this.direction === null || this.opacity <= 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;

    // circle
    gc.save();
    gc.globalAlpha = this.opacity;
    gc.fillStyle = "black";
    gc.lineWidth = 7;
    gc.beginPath();
    gc.arc(centerX, centerY, radius, 0, Math.PI * 2);
    gc.stroke();

    // chevron symbol
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.font = "150px sans-serif";
    gc.fillText(this.direction === "left" ? "<" : ">", centerX , centerY - 8);
    gc.restore();

  }
}
