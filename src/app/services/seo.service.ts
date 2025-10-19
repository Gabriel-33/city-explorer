import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  setPageTitle(title: string) {
    this.title.setTitle(`${title} - Explorador de Cidades Brasileiras`);
  }

  setMetaDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }

  setMetaTags(config: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
  }) {
    // Title da página
    this.setPageTitle(config.title);
    
    // Meta description
    this.setMetaDescription(config.description);
    
    // Keywords
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }
    
    // Open Graph (Facebook, LinkedIn)
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: config.url || window.location.href });
    this.meta.updateTag({ property: 'og:image', content: config.image || '/assets/og-image.jpg' });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image || '/assets/twitter-image.jpg' });
  }
}