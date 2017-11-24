import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';


import { environment } from '../../environments/environment';
import { Document } from '../models/document';
import { Event } from '../models/event';

@Injectable()
export class EventsService {

	private apiUrl = `${environment.apiUrl}`;

 	constructor(
 		private http: HttpClient
 	) {}

	getEvents (): Observable<Event[]> {

		return this.http.get<Event[]>(`${this.apiUrl}api/timeline/getEvents`)

	}

}
