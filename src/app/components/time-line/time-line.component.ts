import { Component,
         OnInit,
         ViewEncapsulation,
         ElementRef,
         Renderer2,
         HostListener,
         AfterViewChecked 
} from '@angular/core';

import * as $ from 'jquery/dist/jquery.min.js';
import { EventsService } from '../../services/events.service';
import { DocumentsService } from '../../services/documents.service';
import { Event } from '../../models/event';
import * as moment from 'moment';

@Component({
    selector: 'app-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimeLineComponent implements OnInit, AfterViewChecked {
	
    events: Event[] = [];
    private timeValues = [];
    private dateParams = [];
    private startParam: number;
    private endParam: number;
    private interval: number;
    private firstSource: number;
    private secondSource: number;
    private param: number;
    private evId: number;
    private document: boolean = false;
    private mouseDown : boolean = false;
    private selectedLeft;
    private selectedEventId;

    private last: MouseEvent;
    private el: HTMLElement;

    constructor(private eventsService: EventsService,
                private documentsService: DocumentsService,
                private elRef: ElementRef,
                private renderer: Renderer2) {}

    ngOnInit() {

    	this.getEvents();

    }

    getEvents() {

    	this.eventsService.getEvents()
    		.subscribe(events => {

                this.events = events;
                this.buildDates(this.events);
                this.buildTimeline(this.events);

            });

    };

    sortEvents( a, b ) {

        if ( a.date < b.date )

            return -1;

        if ( a.date > b.date )

            return 1;

        return 0;

    };

    
    buildDates( params ) {

        let events = params.events;
        events.sort( this.sortEvents );

        this.dateParams = events;
        this.startParam = Date.parse( events[ 0 ].date );
        this.endParam = Date.parse( events[ events.length - 1 ].date );
        this.interval = this.endParam - this.startParam;
        setTimeout( () => {

            this.addActiveCircle();

        }, 500) 

        
    };

    buildTimeline( params ) {

        let sourceIds = params.soursesData.map( function( obj ) {

            return obj._id;

        });

        this.firstSource = sourceIds[ 0 ];
        this.secondSource = sourceIds[ 1 ];

        var startEvent = params.events[ 0 ].date;
        var endEvent = params.events[ params.events.length - 1 ].date;

        var dateStart = moment( startEvent );
        var dateEnd = moment( endEvent );

        while ( dateEnd > dateStart ) {

            let temp = { year: dateStart.format('YYYY'), month: dateStart.format('MMM'), day: dateStart.format('DD') }

            this.timeValues.push(temp);
            dateStart.add( 1, 'month' );

        }

    };

    loadDocument = function ( eid ) {

        this.documentsService.getDocuments( eid )
            .subscribe( (data) => {

                this.document = true;

            });

    };

    compareIds( ids, str, index ) {

        if ( str === 'first' ) {

            this.param = this.firstSource;

        } else {
            
            this.param = this.secondSource;

            if ( ids.length === 1 ) {
    
                this.renderer.addClass(this.elRef.nativeElement.querySelector('.' + index), 'second-circles-group');

            }

        }

        let compare = ( element ) => element === this.param;

        return ids.some( compare );

    };

    compareLineIds( ids, str, index ) {

        if ( str === 'first' && ids.length > 1 ) {

            return true;

        } 

    };

    getLinesElements( ele_id, str, ids ) {

        let element = this.elRef.nativeElement.querySelector('.' + ele_id);

        if ( element ) {

            let date = element.title;
            let millisecondsParams = Date.parse( date );
            let subtract = millisecondsParams - this.startParam;
            let circleMargin = 100 * subtract / this.interval;
            let marginValue = circleMargin + 0.0 + '%';

            if ( this.compareLineIds( ids, str, ele_id ) ) {

                this.renderer.setStyle(this.elRef.nativeElement.querySelector('.' + ele_id), 'margin-left', marginValue);
                this.renderer.addClass(this.elRef.nativeElement.querySelector('.' + ele_id), 'circle-line');

            }

        }

    };

    getCircleElements = function ( ele_id, str, ids ) {
                    
        let element = this.elRef.nativeElement.querySelector('.' + ele_id);
        
        if ( element ) {

            let date = element.title;
            let millisecondsParams = Date.parse( date );
            let subtract = millisecondsParams - this.startParam;
            let circleMargin = 100 * subtract / this.interval;
            let marginValue = circleMargin + 0.0 + '%';

            if ( this.compareIds( ids, str, ele_id ) ) {

                this.renderer.setStyle(this.elRef.nativeElement.querySelector('.' + ele_id), 'margin-left', marginValue);

            } else {

                this.renderer.setStyle(this.elRef.nativeElement.querySelector('.' + ele_id), 'display', 'none');

            }

        }

    };

    addActiveCircle() {

        if ( this.document ) return;

        let element = this.elRef.nativeElement.querySelector('.circ');

        if ( element ) {

            this.evId = $( $('.circ')[0] ).attr('eventId');
            $('.circ[eventId="' + this.evId + '"]').addClass('active-circ');
            $('.indicator').css({
                'display': 'block',
                'left': ( + $( $('.circ')[0] ).css('margin-left').replace('px', '') + 244 + 2 ) + 'px'
            });
            var selectedDate = new Date( this.startParam );
            $('.indicator .label').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );
            $('.table-title .date').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );
            this.loadDocument( this.evId );

        }

    };

    ngAfterViewChecked() {

    };

    // 

    @HostListener("mouseup", ['$event']) onMouseUp(event: MouseEvent) {
        
        this.mouseDown = false;

        // find nearest event

        let x = event.pageX - 244;
        let eventsItems = $('.circ');
        let min = 1000;
        let selectedLeft;
        let selectedEventId = false;
        let selectedDate;

        $('.active-circ').removeClass('active-circ');

        for ( let i = 0, il = eventsItems.length; i < il; i ++ ) {

            let evLeft = + $( eventsItems[ i ] ).css('margin-left').replace('px', '');

            if ( Math.abs( x - evLeft ) < min ) {

                min = Math.abs( x - evLeft );
                selectedLeft = evLeft;
                selectedEventId = $( eventsItems[ i ] ).attr('eventId');
                selectedDate = $( eventsItems[ i ] ).attr('title');

            }

        }

        $('.circ[eventId="' + selectedEventId + '"').addClass('active-circ');

        $('.indicator').css({
            'left': ( selectedLeft + 244 + 2 ) + 'px'
        });

        selectedDate = new Date( selectedDate );
        $('.table-title .date').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );
        $('.indicator .label').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );

        // load info

        this.loadDocument( selectedEventId );

    };

    @HostListener("mousedown", ['$event']) onMouseDown(event: MouseEvent) {
        
        $('.content.show-text-table').addClass('loading');
        $('.source .source-img').addClass('loading');

        event.preventDefault();
        this.mouseDown = true;

        var x = event.pageX - 246;
        var width = window.innerWidth - 246;
        var progress = x / width;

        if ( progress < 0 || progress > 1 ) return;

        $('.indicator').css({
            'left': ( 246 + x ) + 'px'
        });

        var selectedDate = new Date( this.startParam + this.interval * progress );
        $('.indicator .label').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );

    };

    @HostListener('mousemove', ['$event']) onMousemove(event: MouseEvent) {
        
        event.preventDefault();

        var x = event.pageX - 244;
        var width = window.innerWidth - 246;
        var progress = x / width;

        var eventsItems = $('.circ');
        var min = 1000;
        var selectedLeft;
        var selectedEventId = false;

        //

        if ( progress < 0 || progress > 1 ) return;

        if ( this.mouseDown ) {
        console.log(1);
            $('.indicator').css({
                'left': ( 246 + x ) + 'px'
            });

            var selectedDate = new Date( this.startParam + this.interval * progress );
            $('.indicator .label').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );

            //

            $('.active-circ').removeClass('active-circ');

            for ( var i = 0, il = eventsItems.length; i < il; i ++ ) {

                var evLeft = + $( eventsItems[ i ] ).css('margin-left').replace('px', '');

                if ( Math.abs( x - evLeft ) < min ) {

                    min = Math.abs( x - evLeft );
                    selectedLeft = evLeft;
                    selectedEventId = $( eventsItems[ i ] ).attr('eventId');

                }

            }

            $('.circ[eventId="' + selectedEventId + '"').addClass('active-circ');

        }

    };

    @HostListener("window:keyup", ["$event"]) keyEvent(event: KeyboardEvent) {

        var selectedEventId;

        if ( event.keyCode === 39 ) { // next

            selectedEventId = $('.circ.active-circ').next().attr('eventId');

        } else if ( event.keyCode === 37 ) { // back

            selectedEventId = $('.circ.active-circ').prev().attr('eventId');

        }

        if ( selectedEventId === undefined ) return;

        $('.active-circ').removeClass('active-circ');
        $('.circ[eventId="' + selectedEventId + '"').addClass('active-circ');

        $('.indicator').css({
            'left': ( + $('.circ[eventId="' + selectedEventId + '"').css('margin-left').replace('px', '') + 244 + 2 ) + 'px'
        });
        var selectedDate = new Date( new Date( $('.circ[eventId="' + selectedEventId + '"').attr('title') ) );
        $('.indicator .label').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );
        $('.table-title .date').html( selectedDate.getFullYear() + '-' + ( selectedDate.getMonth() + 1 ) + '-' + selectedDate.getDate() );
        this.loadDocument( selectedEventId );

    }

};
