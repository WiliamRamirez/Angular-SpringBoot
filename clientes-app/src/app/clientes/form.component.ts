import { Component, OnInit } from "@angular/core";
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styles: []
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente();
  titulo: string = "Crear Cliente";

  errores: string[];
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activateRouted: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activateRouted.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe(cliente => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(["/clientes"]);
        swal.fire(
          "Nuevo cliente",
          `Cliente ${cliente.nombre} creado con exito`,
          "success"
        );
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error("Codigo del error desde el backend" + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(["/clientes"]);
        swal.fire(
          "Cliente Actualizado",
          `Cliente ${cliente.nombre} actualizado con exito`,
          "success"
        );
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error("Codigo del error desde el backend" + err.status);
        console.error(err.error.errors);
      }
    );
  }
}
