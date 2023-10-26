import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FlightService } from '../flight.service';
import { Flight } from '../flight';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent implements OnInit {

  id!: string;
  flight!: Flight;
  feedback: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService) {
  }

  ngOnInit() {
    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {
          if (id === 'new') { return of(new Flight()); }
          return this.flightService.findById(id);
        })
      )
      .subscribe(flight => {
          this.flight = flight;
          this.feedback = {};
        },
        err => {   //Se tradujo del Ingles al español los mensajes de guardado y advertencia 
          this.feedback = {type: 'Advertencia', message: 'Error al cargar'};
        }
      );
  }

  save() {
    this.flightService.save(this.flight).subscribe(
      flight => {
        this.flight = flight;
        this.feedback = {type: 'Exito', message: '¡El guardado fue exitoso!'};
        setTimeout(() => {
          this.router.navigate(['/Vuelos']);
        }, 1000);
      },
      err => {
        this.feedback = {type: 'Advertencia', message: 'Error al guardar'};
      }
    );
  }

  cancel() {
    this.router.navigate(['/Vuelos']);
  }
}
