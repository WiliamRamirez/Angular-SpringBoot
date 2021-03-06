import { Injectable } from "@angular/core";
import { Cliente } from "./cliente";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ClienteService {
  private urlEndPoint: string = "http://localhost:8080/api/clientes";

  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(private http: HttpClient, private router: Router) {}

  getClientes(page: number): Observable<any> {
    // return of(CLIENTES);
    return this.http.get(this.urlEndPoint + "/page/" + page).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      })
    );
  }

  // Para modificar los valores del html
  // .map(cliente => {
  //   cliente.nombre = cliente.nombre.toUpperCase();
  //   return cliente;
  // });

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente, {
        headers: this.httpHeaders
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if (e.status === 400) {
            return throwError(e);
          }

          console.log(e.error.mensaje);

          swal.fire(e.error.mensaje, e.error.error, "error");

          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        this.router.navigate(["/clientes"]);
        swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders
      })
      .pipe(
        catchError(e => {
          console.log(e.error.mensaje);

          swal.fire(e.error.mensaje, e.error.error, "error");

          return throwError(e);
        })
      );
  }
  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders
      })
      .pipe(
        catchError(e => {
          console.log(e.error.mensaje);

          swal.fire(e.error.mensaje, e.error.error, "error");

          return throwError(e);
        })
      );
  }
}
