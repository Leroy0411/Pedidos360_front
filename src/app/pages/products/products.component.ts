import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService, Product } from '../../core/services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="page">
      <h2>Catálogo de productos</h2>

      @if (loading()) {
        <p>Cargando...</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else {
        <div class="grid">
          @for (product of products(); track product.id) {
            <article class="card">
              <h3>{{ product.name }}</h3>
              <p class="sku">{{ product.sku }}</p>
              <p>{{ product.description }}</p>
              <p class="price">{{ product.price | currency:'CLP':'symbol-narrow':'1.0-0' }}</p>
              <p class="stock">Stock: {{ product.stock }}</p>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .page { padding: 1.5rem; max-width: 960px; margin: 0 auto; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem; background: #fff; }
    .sku { color: #6b7280; font-size: 0.875rem; }
    .price { font-weight: 700; color: #2563eb; }
    .stock { font-size: 0.875rem; }
    .error { color: #dc2626; }
  `,
})
export class ProductsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos. Verifica el BFF y el token JWT.');
        this.loading.set(false);
      },
    });
  }
}
