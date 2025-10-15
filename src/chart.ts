import type { Dataset } from "./datasets";
import { Animator, easeInOut } from "./animator";

export type ChartProps = {
  bottomHeight?: number;
  margin?: number;
};

export class Chart {
  bottomHeight: number;
  margin: number;

  private x = 0;
  private y = 0;
  private w = 0;
  private h = 0;
  private barBounds: { x: number; y: number; w: number; h: number }[] = [];
  private barProgress: number[] = [];
  private barAnimators: Array<Animator | null> = [];
  private readonly barAnimationDuration = 1000;

  constructor({ bottomHeight = 50, margin = 10 }: ChartProps = {}) {
    this.bottomHeight = bottomHeight;
    this.margin = margin;

  }

  startBarAnimation(dataset: Dataset, startTime: number) {
    const count = dataset.values.length;
    this.barProgress = new Array(count).fill(0);
    this.barAnimators = new Array(count).fill(null);

    for (let i = 0; i < count; i++) {
      const animator = new Animator(
        0,
        1,
        this.barAnimationDuration,
        (value) => { this.barProgress[i] = value;},
        easeInOut
      );
      animator.start(startTime);
      this.barAnimators[i] = animator
    }
  }

  updateAnimations(time: number) {
    for (let i = 0; i < this.barAnimators.length; i++) {
      const animator = this.barAnimators[i];
      if (!animator) continue;
      animator.update(time);
      if (!animator.isRunning) {
        this.barAnimators[i] = null;
      }
    }
  }

  barHitTest(mx: number, my: number): number | null {
    for (let i = 0; i < this.barBounds.length; i++) {
      const { x, y, w, h } = this.barBounds[i];
      const hitY = h > 0 ? y : y - 5;
      const hitH = h > 0 ? h : 10;
      if (mx >= x && mx <= x + w && my >= hitY && my <= hitY + hitH) {
        return i;
      }
    }
    return null;
  }

  private layout(width: number, height: number) {
    const availableHeight = height - this.bottomHeight - 2 * this.margin;
    const availableWidth = width - 2 * this.margin;

    this.h = availableHeight;
    this.w = (4 / 3) * this.h;

    if (availableWidth < this.w) {
      this.w = availableWidth;
      this.h = (3 / 4) * this.w;
    }

    this.x = (width - this.w) / 2;
    this.y = (height - this.bottomHeight - this.h) / 2;
  }

  draw(
    gc: CanvasRenderingContext2D,
    dataset: Dataset,
    hoverBarIndex: number | null,
    selectedBarIndex: number | null
  ) {
    const width = gc.canvas.width;
    const height = gc.canvas.height;

    this.layout(width, height);
    this.barBounds = [];

    this.drawTopArea(gc, width, height);
    this.drawChartArea(gc);
    this.drawTitle(gc, dataset.title);
    this.drawBars(gc, dataset, hoverBarIndex, selectedBarIndex);
    this.drawAxes(gc);
    this.drawTicks(gc);
  }

  private drawTopArea(
    gc: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    gc.fillStyle = "gray";
    gc.fillRect(0, 0, width, height - this.bottomHeight);
  }

  private drawChartArea(gc: CanvasRenderingContext2D) {
    gc.fillStyle = "white";
    gc.fillRect(this.x, this.y, this.w, this.h);
  }

  private drawTitle(gc: CanvasRenderingContext2D, title: string) {
    gc.fillStyle = "black";
    gc.font = "18px sans-serif";
    gc.textAlign = "center";
    gc.textBaseline = "middle";

    const titleX = this.x + this.w / 2;
    const titleY = this.y + 60 / 2;
    gc.fillText(title, titleX, titleY);
  }

  private drawAxes(gc: CanvasRenderingContext2D) {
    const chartLeft = this.x;
    const chartRight = this.x + this.w;
    const chartTop = this.y;
    const chartBottom = this.y + this.h;

    const xAxisY = chartBottom - 60;
    const yAxisX = chartLeft + 60;

    gc.strokeStyle = "black";
    gc.lineWidth = 1;

    gc.beginPath();
    gc.moveTo(chartLeft + 60, xAxisY);
    gc.lineTo(chartRight - 30, xAxisY);
    gc.stroke();

    gc.beginPath();
    gc.moveTo(yAxisX, xAxisY);
    gc.lineTo(yAxisX, chartTop + 60);
    gc.stroke();
  }

  private drawTicks(gc: CanvasRenderingContext2D) {
    const chartTop = this.y;
    const chartBottom = this.y + this.h;
    const yAxisX = this.x + 60;
    const axisTop = chartTop + 60;
    const xAxisY = chartBottom - 60;
    const gap = (xAxisY - axisTop) / 10;

    gc.strokeStyle = "black";
    gc.lineWidth = 1;
    gc.font = "14px sans-serif";
    gc.fillStyle = "black";
    gc.textAlign = "right";
    gc.textBaseline = "middle";

    for (let i = 0; i <= 10; i++) {
      const y = xAxisY - i * gap;

      gc.beginPath();
      gc.moveTo(yAxisX, y);
      gc.lineTo(yAxisX - 5, y);
      gc.stroke();

      if (i % 2 === 0) {
        gc.fillText(String(i * 10), yAxisX - 10, y);
      }
    }
  }

  private drawBars(
    gc: CanvasRenderingContext2D,
    dataset: Dataset,
    hoverBarIndex: number | null,
    selectedBarIndex: number | null
  ) {
    const labels = dataset.labels;
    const values = dataset.values;
    const n = labels.length;

    if (n === 0) {
      return;
    }

    // plot area
    const plotX = this.x + 60;
    const plotY = this.y + 60;
    const plotW = this.w - 60 - 30;
    const plotH = this.h - 60 - 60;

    // bottom of plot
    const xaxisY = plotY + plotH;

    const gap = 20;
    const barW = (plotW - (n + 1) * gap) / n;

    gc.font = "14px sans-serif";
    gc.textAlign = "center";
    gc.textBaseline = "top";

    for (let i = 0; i < n; i++) {
      const x = plotX + gap + (gap + barW) * i;
      const progress = this.barProgress[i] ?? 1;
      const visibleValue = progress * values[i];
      const barH = (visibleValue / 100) * plotH;
      const barY = xaxisY - barH;

      this.barBounds[i] = { x, y: barY, w: barW, h: barH };

      // fill bars
      const hue = (360 / n) * i;
      if (i === hoverBarIndex) {
        gc.fillStyle = `hsl(${hue} 80% 35%)`;
      } else {
        gc.fillStyle = `hsl(${hue} 80% 50%)`;
      }
      gc.fillRect(x, barY, barW, barH);

      // bar borders
      gc.strokeStyle = "black";
      gc.lineWidth = 1;
      gc.strokeRect(x, barY, barW, barH);

      // selected border
      if (i === selectedBarIndex) {
        gc.strokeStyle = "dodgerblue";
        gc.lineWidth = 4;
        gc.strokeRect(x - 2.5 , barY - 2.5, barW + 5, barH + 5);
      }

      // bar labels
      gc.fillStyle = "black";
      gc.font = "14px sans-serif";
      gc.textAlign = "center";
      gc.textBaseline = "top";
      gc.fillText(labels[i], x + barW / 2, xaxisY + 10);

      // hover label
      if (i === hoverBarIndex) {
        gc.font = "14px sans-serif";
        gc.textAlign = "center";
        if (barH > 20 && barW > 20) {
          gc.fillStyle = "white";
          gc.textBaseline = "middle";
          gc.fillText(String(values[i]), x + barW / 2, barY + barH / 2);
        } else {
          gc.fillStyle = "black";
          gc.textBaseline = "bottom";
          gc.fillText(String(values[i]), x + barW / 2, barY - 10);
        }
      }
    }
  }
}
