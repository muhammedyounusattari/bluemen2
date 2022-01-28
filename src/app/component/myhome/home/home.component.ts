import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TimeClockComponent } from './time-clock/time-clock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public popup: string;
  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
      this.popup = params?.popup;
      console.log(this.popup);
      if (this.popup == 'time-clock') {
        this.openTimeClock();
      }
    }
  );
  }

  /**
   * @method openTimeClock
   */
  public openTimeClock() {
    this.dialog.open(TimeClockComponent, {
      width: '50%',
      panelClass: 'time-clock-container'
    });
  }
}
