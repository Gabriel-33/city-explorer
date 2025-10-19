import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ad-unit',
  template: `
    <div class="ad-container" [class.mobile]="isMobile" [class.desktop]="!isMobile">
      <!-- Placeholder durante desenvolvimento -->
      <div *ngIf="showPlaceholder" class="ad-placeholder">
        🎯 Anúncio Google Ads ({{ adSlot }})
      </div>
      
      <!-- Anúncio real -->
      <ins *ngIf="!showPlaceholder"
        class="adsbygoogle"
        style="display:block;"
        [attr.data-ad-client]="adClient"
        [attr.data-ad-slot]="adSlot"
        [attr.data-ad-format]="adFormat"
        [attr.data-full-width-responsive]="fullWidthResponsive">
      </ins>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdUnitComponent implements AfterViewInit, OnDestroy {
  @Input() adSlot!: string;
  @Input() adFormat: string = 'auto';
  @Input() isMobile: boolean = false;
  @Input() showPlaceholder: boolean = false; // Defina como false em produção

  readonly adClient = 'ca-pub-2356473671774504';
  readonly fullWidthResponsive = 'true';
  private adLoaded = false;

  ngAfterViewInit() {
    if (!this.showPlaceholder) {
      this.loadAd();
    }
  }

  private loadAd() {
    if (this.adLoaded) return;

    setTimeout(() => {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        this.adLoaded = true;
      } catch (e) {
        console.error('Erro ao carregar anúncio:', e);
      }
    }, 300);
  }

  ngOnDestroy() {
    this.adLoaded = false;
  }
}