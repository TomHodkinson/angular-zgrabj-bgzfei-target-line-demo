import {
  Component,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Path } from '@progress/kendo-drawing';
import { DashType } from '@progress/kendo-angular-charts';


@Component({
  selector: 'my-app',
  //templateUrl: './study-patients-chart-target-country.component.html',
  //styleUrls: ['./study-patients-chart-target-country.component.less'],
  template: `
    <div class="content-container">
    <div class="chart-wrapper">
      <kendo-chart
        [style.height.px]="chartHeight"
        style="width: 100%"
      >
        <kendo-chart-category-axis>
          <kendo-chart-category-axis-item
            [categories]="chartCategories"
          >
          </kendo-chart-category-axis-item>
        </kendo-chart-category-axis>

        <kendo-chart-value-axis>
          <kendo-chart-value-axis-item
            name="value"
            [labels]="{ padding: 8, step: 2 }"
            [visible]="true"
          >
          </kendo-chart-value-axis-item>
        </kendo-chart-value-axis>

        <kendo-chart-area background="transparent" margin="0"></kendo-chart-area>

        <kendo-chart-legend
          [position]="legendPosition"
          orientation="horizontal"
        ></kendo-chart-legend>

        <kendo-chart-series>
          <kendo-chart-series-item
            *ngFor="let seriesItem of seriesItems; last as isLast; let i = index"
            type="bar"
            [stack]="true"
            [data]="seriesItem.data"
            [name]="seriesItem.name"
            [visual]="seriesVisual"

            [visible]="true"
            style="cursor: pointer"
          >
            
          </kendo-chart-series-item>
        </kendo-chart-series>
      </kendo-chart>
    </div>
  </div>
  `
})

export class AppComponent {
  @Input() title: string = 'Demo';
  @Input() seriesItems: any[] = [
    {
      name: 'Enrolled',
      data: [4],
    },
    {
      name: 'Projected  0-30 days',
      data: [2],
    },
    {
      name: 'Projected 31-60 days',
      data: [5],
    },
    {
      name: 'Projected 61-90 days',
      data: [7],
      targetArray: [[5], [8], [15], [12]]
    },
  ];
  @Input() categories: string[] = ['Demo Category'];
  @Input() targetSeriesArray: any[] = [
    { name: 'Enrolled', index: 0, title: 'Enrolled (Target-to-Date)', dashType: 'dot' },
    {
      name: 'Projected  0-30 days',
      index: 1,
      title: 'Target projected 0 to 30 days',
      dashType: 'solid',
    },
    {
      name: 'Projected 31-60 days',
      index: 2,
      title: 'Target projected 31 to 60 days',
      dashType: 'dash',
    },
    {
      name: 'Projected 61-90 days',
      index: 3,
      title: 'Target projected 61 to 90 days',
      dashType: 'longDash',
    },
  ];
  @Input() chartHeight = 350;
  @Input() legendPosition = 'bottom';
  @Input() valueAxisVisible = true;



  //seriesItems: any[] = [];
  chartCategories: string[] = ['Demo Category'];

  // Category Axis styling
  categoryAxisLabels = {
    color: 'var(--text-interactive)',
    visual: (e) => {
      const visual = e.createVisual();
      visual.options.cursor = 'pointer';
      return visual;
    },
  };

  constructor() {}


  seriesVisual = (e: any): any => {
    const visual = e.createVisual();
    if (e.category === undefined) {
      return visual;
    }

    
    const categoryIdx = this.categories.indexOf(e.category);
    console.log(categoryIdx)
    if (categoryIdx < 0) {
      return visual;
    }

    // Create the target line
  //console.log(e)
    for (let i = 0; i < this.targetSeriesArray.length; i++) {
      if (
        e.series.name === this.targetSeriesArray[i].name &&
        this.seriesItems[this.seriesItems.length - 1].targetArray[i] !== undefined
      ) {
        const axis = e.sender.findAxisByName('value');
        const target = this.seriesItems[this.seriesItems.length - 1].targetArray[i][categoryIdx];
        const targetX = axis.slot(target).origin.x;
        const path = new Path({
          stroke: {
            width: 2,
            color: this.getTargetColor(i), //'var(--chart-target, #2d28c8)',
            dashType: this.getDashType(this.targetSeriesArray[i].dashType.toString()), //"solid",
          },
        })
          .moveTo(targetX, e.rect.origin.y - 5)
          .lineTo(targetX, e.rect.bottomRight().y + 12);
        visual.append(path);
      }
    }

    return visual;
  };

  getTargetColor(index) {
    let colors = ['#e03a9b', '#1d44c4', '#c41da8', '#1dc4b3'];
    if (colors.length > index) {
      return colors[index];
    } else {
      return 'var(--chart-target, #2d28c8)';
    }
  }

  getDashType(name: string): DashType {
    return 'solid';
  }

  getDashTypeClass(index) {
    switch (index) {
      case 0: {
        return 'targetItem-0';
      }
      case 1: {
        return 'targetItem-1';
      }
      case 2: {
        return 'targetItem-2';
      }
      case 3: {
        return 'targetItem-3';
      }
      default:
        return 'target-dot';
    }
  }
}