import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface Order {
  id: number;
  customerEmail: string;
  productId: number;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  totalAmount: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/products`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/api/orders`);
  }

  createOrder(body: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/api/orders`, body);
  }

  confirmOrder(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/api/orders/${id}/confirm`, {});
  }
}
