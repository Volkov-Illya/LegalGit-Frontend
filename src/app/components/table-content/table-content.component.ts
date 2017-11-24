import { Component, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';

import { DocumentsService } from '../../services/documents.service';
import * as $ from 'jquery/dist/jquery.min.js';

@Component({
	selector: 'app-table-content',
	templateUrl: './table-content.component.html',
	styleUrls: ['./table-content.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TableContentComponent implements OnInit, OnChanges {

	private leftText;
	private leftImage;
	private rightText;
	private rightImage;

	constructor(private documentsService: DocumentsService) {

		this.documentsService.documentsAdded
		.subscribe(
	        ( document ) => {
	            
	            let data = document[ 0 ];

	            if ( data[ 0 ] ) {

                    this.leftText = data[ 0 ].text;
                    this.leftImage = data[ 0 ].iid + '.png';

                } else {

                    this.leftText = '';
                    this.leftImage = false;

                }

                if ( data[ 1 ] ) {

                    this.rightText = data[ 1 ].text;
                    this.rightImage = data[ 1 ].iid + '.png';

                } else {

                    this.rightText = '';
                    this.rightImage = false;

                }

                $('.loading').removeClass('loading');

        });

	}

	ngOnInit() {
	}

	ngOnChanges() {
	}

}
