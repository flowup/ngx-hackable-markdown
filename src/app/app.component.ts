import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  markdownSource: string;

  myRedirectHandler(url: string): void {
    window.alert(`This link redirects to ${url}`);
  }
}
