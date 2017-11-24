import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map'


import { environment } from '../../environments/environment';
import { Document } from '../models/document';
import { Event } from '../models/event';

@Injectable()
export class DocumentsService {

	public documentsAdded = new EventEmitter<Document[]>();
	public documents = []
	public apiUrl: string;
	private document: Document[] = [];

 	constructor(private http: HttpClient) {

 		this.apiUrl = `${environment.apiUrl}api/timeline/getDocuments`;

 	}

	getDocuments(id: string): Observable<any> {

		this.documents.length = 0;

		let params = new HttpParams().set('id', id);

		return this.http.get<Document[]>(this.apiUrl, { params })
		.map( (data) => {

			this.documents.push(data);
			this.documentsAdded.emit(this.documents.slice(0, 1));
			return data;

		})

    };

}
