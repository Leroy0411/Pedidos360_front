import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Order, Product } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  template: `
    <section class="page">
      <h2>Pedidos</h2>

      <form class="order-form" (ngSubmit)="submitOrder()">
        <h3>Nuevo pedido</h3>
        <label>
          Producto
          <select [(ngModel)]="selectedProductId" name="productId" required>
            @for (p of products(); track p.id) {
              <option [ngValue]="p.id">{{ p.name }} — {{ p.price | currency:'CLP':'symbol-narrow':'1.0-0' }}</option>
            }
          </select>
        </label>
        <label>
          Cantidad
          <input type="number" min="1" [(ngModel)]="quantity" name="quantity" required />
        </label>
        <button type="submit" class="btn primary" [disabled]="submitting()">Crear pedido</button>
        @if (formMessage()) {
          <p [class]="formMessageClass()">{{ formMessage() }}</p>
        }
      </form>

      <h3>Listado</h3>
      @if (loading()) {
        <p>Cargando...</p>
      } @else if (orders().length === 0) {
        <p>No hay pedidos.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              @if (auth.isAdmin()) { <th>Acción</th> }
            </tr>
          </thead>
          <tbody>
            @for (order of orders(); track order.id) {
              <tr>
                <td>{{ order.id }}</td>
                <td>{{ order.productId }}</td>
                <td>{{ order.quantity }}</td>
                <td>{{ order.totalAmount | currency:'CLP':'symbol-narrow':'1.0-0' }}</td>
                <td><span class="badge">{{ order.status }}</span></td>
                <td>{{ order.createdAt | date:'short' }}</td>
                @if (auth.isAdmin()) {
                  <td>
                    @if (order.status === 'PENDING') {
                      <button type="button" class="btn small" (click)="confirm(order.id)">Confirmar</button>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: `
    .page { padding: 1.5rem; max-width: 960px; margin: 0 auto; }
    .order-form {
      background: #f9fafb;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 2rem;
      display: grid; gap: 0.75rem;
    }
    label { display: grid; gap: 0.25rem; font-size: 0.875rem; }
    select, input { padding: 0.5rem; border-radius: 6px; border: 1px solid #d1d5db; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
    .badge { background: #dbeafe; color: #1d4ed8; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
    .btn { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #2563eb; background: #fff; color: #2563eb; cursor: pointer; }
    .btn.primary { background: #2563eb; color: #fff; }
    .btn.small { font-size: 0.75rem; padding: 0.25rem 0.5rem; }
    .success { color: #16a34a; }
    .error { color: #dc2626; }
  `,
})
export class OrdersComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  readonly orders = signal<Order[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly formMessage = signal<string | null>(null);
  readonly formMessageClass = signal('');

  selectedProductId = 1;
  quantity = 1;

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        if (data.length > 0) {
          this.selectedProductId = data[0].id;
        }
      },
    });

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.api.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitOrder(): void {
    const product = this.products().find((p) => p.id === this.selectedProductId);
    if (!product) return;

    this.submitting.set(true);
    this.formMessage.set(null);

    this.api.createOrder({
      productId: product.id,
      quantity: this.quantity,
      totalAmount: product.price * this.quantity,
    }).subscribe({
      next: () => {
        this.formMessage.set('Pedido creado correctamente');
        this.formMessageClass.set('success');
        this.submitting.set(false);
        this.loadOrders();
      },
      error: () => {
        this.formMessage.set('Error al crear el pedido');
        this.formMessageClass.set('error');
        this.submitting.set(false);
      },
    });
  }

  confirm(id: number): void {
    this.api.confirmOrder(id).subscribe({
      next: () => this.loadOrders(),
    });
  }
}
