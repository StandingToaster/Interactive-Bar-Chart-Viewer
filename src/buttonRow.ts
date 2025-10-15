import { Animator, easeIn } from "./animator";

export type ButtonRowProps = {
  height?: number;
};

export class ButtonRow {
  readonly height: number;
  private readonly buttonCount = 10;
  private readonly diameter = 30;
  private readonly gap = 10;

  private readonly animationDuration = 500;
  private buttonProgress: number[];
  private buttonAnimators: Array<Animator | null>;

  constructor({ height = 50 }: ButtonRowProps = {}) {
    this.height = height;
    this.buttonProgress = new Array(this.buttonCount).fill(0);
    this.buttonAnimators = new Array(this.buttonCount).fill(null);
    this.buttonProgress[0] = 1; // button 1 starts seleted and already filled
  }

  startSelectionAnimation(index: number, startTime: number) {
    for (let i = 0; i < this.buttonCount; i++) {
      if (i === index) {
        const animator = new Animator(
          this.buttonProgress[i],
          1,
          this.animationDuration,
          (value: number) => {
            this.buttonProgress[i] = value;
          },
          easeIn
        );
        animator.start(startTime);
        this.buttonAnimators[i] = animator;
      } else {
        this.buttonProgress[i] = 0;
        this.buttonAnimators[i] = null;
      }
    }
  }

  updateAnimations(time: number) {
    for (let i = 0; i < this.buttonAnimators.length; i++) {
      const animator = this.buttonAnimators[i];
      if (!animator) continue;
      animator.update(time);
      if (!animator.isRunning) {
        this.buttonAnimators[i] = null;
      }
    }
  }

  buttonHitTest(
    mx: number,
    my: number,
    canvasWidth: number,
    canvasHeight: number
  ): number | null {
    const rowWidth =
      (this.gap + this.diameter) * (this.buttonCount - 1) + this.diameter;
    const startX = (canvasWidth - rowWidth) / 2;
    const centerY = canvasHeight - this.height / 2;
    const radius = this.diameter / 2;

    for (let i = 0; i < this.buttonCount; i++) {
      const centerX =
        startX + this.diameter / 2 + (this.diameter + this.gap) * i;

      const dx = mx - centerX;
      const dy = my - centerY;
      if (dx * dx + dy * dy <= radius * radius) {
        return i;
      }
    }

    return null;
  }

  draw(gc: CanvasRenderingContext2D, hoverButton: number | null) {
    const width = gc.canvas.width;
    const height = gc.canvas.height;
    const top = height - this.height;

    gc.fillStyle = "lightgray";
    gc.fillRect(0, top, width, this.height);
    this.drawDivider(gc, width, height - this.height);
    this.drawButtons(gc, hoverButton);
  }

  private drawDivider(gc: CanvasRenderingContext2D, width: number, y: number) {
    gc.strokeStyle = "black";
    gc.lineWidth = 1;
    gc.beginPath();
    gc.moveTo(0, y);
    gc.lineTo(width, y);
    gc.stroke();
  }

  private drawButtons(
    gc: CanvasRenderingContext2D,
    hoverButtonIndex: number | null
  ) {
    const width = gc.canvas.width;
    const height = gc.canvas.height;

    const rowWidth =
      (this.gap + this.diameter) * (this.buttonCount - 1) + this.diameter;
    const startX = (width - rowWidth) / 2;
    const centerY = height - this.height / 2;

    for (let i = 0; i < this.buttonCount; i++) {
      const centerX =
        startX + this.diameter / 2 + (this.diameter + this.gap) * i;
      const radius = this.diameter / 2;
      const progress = this.buttonProgress[i];

      // hover
      if (i === hoverButtonIndex) {
        gc.beginPath();
        gc.arc(centerX, centerY, this.diameter / 2 + 2.5, 0, Math.PI * 2);
        gc.strokeStyle = "gold";
        gc.lineWidth = 3;
        gc.stroke();
      }

      // base circle
      gc.beginPath();
      gc.arc(centerX, centerY, radius, 0, Math.PI * 2);
      gc.fillStyle = "whitesmoke";
      gc.fill();
      gc.lineWidth = 2;
      gc.strokeStyle = "black";
      gc.stroke();

      if (progress > 0) {
        gc.beginPath();
        gc.arc(centerX, centerY, radius * progress, 0, Math.PI * 2);
        gc.fillStyle = "dodgerblue";
        gc.fill();
      }

      // number
      gc.font = "18px sans-serif";
      gc.textAlign = "center";
      gc.textBaseline = "middle";
      gc.fillStyle = progress >= 0.99 ? "white" : "black";
      gc.fillText(String(i + 1), centerX, centerY);
    }
  }
}
