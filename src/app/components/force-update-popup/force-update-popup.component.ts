import { Component, Input, Output, EventEmitter } from '@angular/core';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-force-update-popup',
  template: `
    <div class="update-popup-overlay" *ngIf="show">
      <div class="update-popup-container">
        <div class="update-popup-content">
          <div class="update-icon">
            <ion-icon name="arrow-up-circle-outline"></ion-icon>
          </div>
          <h2>Update Required</h2>
          <p class="version-info">New version {{newVersion}} is available</p>
          <p class="current-version">Current version: {{currentVersion}}</p>
          <p class="update-message">{{force ? 'Please update to continue using the app.' : 'A new version is available for download.'}}</p>
          
          <div class="update-buttons">
            <button class="update-btn" (click)="onUpdate()">
              Update Now
            </button>
            <button *ngIf="!force" class="later-btn" (click)="onLater()">
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .update-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .update-popup-container {
      width: 90%;
      max-width: 320px;
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .update-popup-content {
      text-align: center;
    }

    .update-icon {
      font-size: 48px;
      color: #005BC3;
      margin-bottom: 16px;
    }

    .update-icon ion-icon {
      font-size: 64px;
    }

    h2 {
      color: #333;
      margin: 0 0 12px;
      font-size: 24px;
      font-weight: 600;
    }

    .version-info {
      color: #005BC3;
      font-size: 18px;
      font-weight: 500;
      margin: 8px 0;
    }

    .current-version {
      color: #666;
      font-size: 14px;
      margin: 4px 0;
    }

    .update-message {
      color: #666;
      font-size: 14px;
      margin: 12px 0 20px;
    }

    .update-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .update-btn {
      background: #005BC3;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    }

    .later-btn {
      background: #f5f5f5;
      color: #666;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    }
  `]
})
export class ForceUpdatePopupComponent {
  @Input() show: boolean = false;
  @Input() newVersion: string = '';
  @Input() currentVersion: string = '';
  @Input() force: boolean = false;
  @Input() storeUrl: string = '';
  @Output() update = new EventEmitter<void>();
  @Output() later = new EventEmitter<void>();

  onUpdate() {
    this.update.emit();
  }

  onLater() {
    this.later.emit();
  }
} 