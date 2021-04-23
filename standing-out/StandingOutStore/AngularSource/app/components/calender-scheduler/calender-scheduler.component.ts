import { Component, OnInit, AfterViewInit, ViewChild, Inject, EventEmitter, Output, Input, SimpleChanges, ChangeDetectorRef, HostListener } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput, Calendar, DateEnv, elementClosest } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { AvailabilityDialog } from './availability-dialog';
import { TutorInfoDialogComponent } from '../tutor/tutors-index/tutor-info-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { CoursesService } from '../../services';
@Component({
    selector: 'app-calender-scheduler',
    templateUrl: './calender-scheduler.component.html',
    styleUrls: ['./calender-scheduler.component.scss']
})
export class CalenderSchedulerComponent implements OnInit, AfterViewInit {
    public events;
    public selectedWeekIndex;
    @Input() isWeekVisible: boolean = true;
    @Input() isViewOnly: boolean = false;
    @Input() tutorEvents: any;
    @Input() tutorId: any;
    @Input() registerdEvents: any;
    @Input() isDateEventEditable: boolean = true;
    @Input() bookedSlot: any;
    @Input() isBookedSlotVisible: boolean = false;
    @Input() showAvailabilityPopup:boolean = true;
    @Input() courseId: any;
    @Input() ownerId: any;
    @Output() getEventsOnSidebar = new EventEmitter<any>();
    @Output() renderComplete = new EventEmitter<any>();
    @Input() fromSettingPage: boolean = false;

    
    public addedEvents = [];
    public newChange: boolean = false;
    public deletedEvents = [];
    public eventOnDate = {};
    public bookedSlotObj = {};
    clickedEvent: any = [];

    settingCalendarBookedCount = 0;

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',//dayGridMonth,timeGridDay
        editable: true,
        headerToolbar: {
            left: 'prev,title,next today',
            center: '',
            right: ''
        },
        dateClick: this.onDateClick.bind(this), // bind is important!,
        eventClick: this.onEventClick.bind(this),
        //eventOrder: 'slotType',
        eventContent: function (arg) {
            let titleClass = arg.event.extendedProps.custom.titleClass ? arg.event.extendedProps.custom.titleClass : "ava-slot";
            let serialNumber = arg.event.extendedProps.custom.serialNumber ? arg.event.extendedProps.custom.serialNumber : '';
            let titleHtml = `<span class="${titleClass}"><small>${serialNumber}</small>${arg.event.title}</span>`
            return { html: titleHtml }
        }
    };

    @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;

    calendarEvents: EventInput[] = [];

    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

    calendarApi: Calendar;
    initialized = false;
    constructor(public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef, private toastr: ToastrService, private coursesService: CoursesService) { }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        //console.log(event.target.innerWidth);
        //if (event.target.innerWidth < 514) {
        //    this.calendarApi.changeView('timeGridDay');
        //}
        //else {
        //    if (event.target.innerWidth < 796) {
        //        this.calendarApi.changeView('dayGridWeek');
        //    }
        //    else {
        //        this.calendarApi.changeView('dayGridMonth');
        //    }
        //}

        //debugger;
        if (this.isMobile()) {
            this.calendarApi.changeView('timeGridDay');

        } else {
            this.calendarApi.changeView('dayGridMonth');
        }
        this.calendarApi.render();
    }

    getScreenSize(event?) {
        let scrHeight = window.innerHeight;
        let scrWidth = window.innerWidth;
        console.log(scrHeight, scrWidth);

        if (scrWidth <= 1025) {
            setTimeout(() => {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
                $('#monthChangeButtons').css('display', 'block');
            }, 300)
        } else {
            $('#myOtherLessonView').css('display', 'none');
            //$('#monthChangeButtons').css('display', 'none');
            $('.mfs').css('display', 'block');
        }

        if (scrWidth >= 1350) {
            setTimeout(() => {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300)
        }

        if (scrWidth <= 768) {
            setTimeout(() => {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300)

        } else {
            setTimeout(() => {
                $('.fc-today-button').removeClass('col-12');
            }, 300)
        }

    }
    ngOnInit() {
        this.getScreenSize();
    }



    ngAfterViewChecked() {
        this.calendarApi = this.calendarComponent.getApi();

        if (this.calendarApi && !this.initialized) {

            this.initialized = true;
            this.loadTutorAllEvents();

        }
    }


    /*ngDoCheck(){
      ////;
      //this.changeDetectorRef.detectChanges();
      //this.calendarApi = this.calendarComponent.getApi();
      
    }*/

    isMobile() { return ('ontouchstart' in document.documentElement); }

    ngOnChanges(changes: SimpleChanges) {
        debugger;
        

        if (!this.calendarApi) {
            //return;
            this.changeDetectorRef.detectChanges();
            this.calendarApi = this.calendarComponent.getApi();
        }

        if (this.isMobile()) {
            //this.calendarOptions.initialView = 'timeGridDay';
            this.calendarApi.changeView('timeGridDay');

        } else {
            this.calendarApi.changeView('dayGridMonth');
            //this.calendarOptions.initialView = 'dayGridMonth';
        }
        //if (this.tutorEvents) {
        //    this.loadTutorAllEvents();
        //}

        if (this.registerdEvents && changes.registerdEvents && this.tutorId) {
            this.calendarApi.removeAllEvents();
            this.addedEvents = [];
            this.eventOnDate = {};
            this.makeBookedSlotObj();

            this.registerdEvents.map(r => {
                this.setAvailabilityEvents(r);
            });

            if (this.deletedEvents) {
                this.deletedEvents.map(r => {
                    let dt = r.startTime.split("T")[0]
                    let did = dt + "-" + r.title;
                    let dEvent = this.calendarApi.getEventById(did);
                    if (dEvent && dEvent.extendedProps.custom.type=='weekEvent') {
                        dEvent.remove();
                        this.calendarApi.render();
                    }
                })
            }
            debugger;
            this.renderComplete.emit();
        }
    }

    ngAfterViewInit() { }
    loadEvents() { }
    loadTutorAllEvents() {
        if (!this.tutorEvents) {
            return;
        }


        this.tutorEvents.map(t => {
            let d = new Date(t.date);
            let [fromHour, fromMinute] = t.fromTime.split(":");
            let [toHour, toMinute] = t.toTime.split(":");

            fromHour = parseInt(fromHour);
            fromMinute = parseInt(fromMinute);
            toHour = parseInt(toHour);
            toMinute = parseInt(toMinute);

            let event = {
                title: t.fromTime + "-" + t.toTime,
                start: d.setHours(fromHour, fromMinute, 0, 0),
                end: d.setHours(toHour, toMinute, 0, 0),
                allday: false,
                editable: false,
                custom: {
                    date: d.toISOString().slice(0, 10),
                    fromTime: t.fromTime,
                    toTime: t.toTime,
                    type: 'dateEvent'
                },
                id: t.id
            };
            this.calendarApi.addEvent(event);
        });

    }


    onDateClick(clickedDate: any) { 
        if (!this.isDateEventEditable) {
            return;
        }
        let d = new Date();
        d.setHours(0, 0, 0, 0);
        clickedDate.date.setHours(0, 0, 0, 0);

        if (d > clickedDate.date) {
            //alert('You can not add/edit event on previous dates');
            this.toastr.warning('You can not add/edit event on previous dates!');
            return;
        }
        let obj = { date: clickedDate.dateStr, type: '', fromTime: '', toTime: '', selectedWeekIndex: '' }
        this.setEventOnWeek("", -1, "", "", obj);
    }

    onEventClick(clickedEvent: any) {
        
        if (this.isViewOnly) {
            return;
        }
        //if (clickedEvent.event.extendedProps.custom.titleClass == 'slot-disabled') {
        if (['slot-disabled', 'ava-slot slot-active'].includes(clickedEvent.event.extendedProps.custom.titleClass)) {
            this.toastr.error('Slot already selected', 'Prohibated');
            return;
        }
        let d1 = new Date();
        let d2 = new Date(clickedEvent.event.extendedProps.custom.date);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);

        if (d1 > d2) {
            //alert('You can not add/edit event on previous dates');
            this.toastr.warning('You can not add/edit event on previous dates!');
            return;
        }

        if (!this.isDateEventEditable) {
            let currTime = new Date().getTime();
            let slotStart = new Date(clickedEvent.event.start).getTime();
            if (slotStart < currTime) {
                this.toastr.warning('You can not choose this slot', 'Past Time');
                return;
            }
            let n = d1.getTimezoneOffset() * -1;
            let c1: any = Math.floor(n / 60);
            c1 = (c1 < 10 ? '0' : '') + c1;
            //let offsetStr = c + ':' + n % 60;
            let ms: any = n % 60;
            ms = (ms < 10 ? '0' : '') + ms;
            let offsetStr = '+' + c1 + ':' + ms;

            let startDate = clickedEvent.event.extendedProps.custom.date + 'T' + clickedEvent.event.extendedProps.custom.fromTime + ":00"+offsetStr;

            var checkSlot = {
                ownerId: this.ownerId,
                startDate: startDate
            }
            this.coursesService.checkSlotAvailability(checkSlot).subscribe(success => {
                if (success) {
                    this.getEventsOnSidebar.emit(clickedEvent);
                }
                else {
                    debugger;
                    let eventObj;
                    if (clickedEvent.event.extendedProps.custom.type == 'dateEvent') {
                        eventObj=this.getSingleEvent(clickedEvent.event,0);
                    }
                    else {
                        eventObj= this.getPatternEvent(clickedEvent.event, 0)
                    }

                    clickedEvent.event.remove();
                    this.calendarApi.addEvent(eventObj);
                    this.calendarApi.render();
                        
                    this.toastr.warning('This slot is already selected,You can not choose this slot');
                }
            }, error => {
            });
            
            return;
        }

        ;
        let ev = clickedEvent.event.extendedProps.custom;
        if (ev.titleClass == 'ava-slot slot-active') {
            this.toastr.warning('You can not edit used slot!');
            return;
        }
        let addedIndex = -1;
        if (ev.type == 'weekEvent') {
            //addedIndex = this.getIndexOfRecurEvent(ev);
        } else {
            addedIndex = this.getIndexOfSingleEvent(clickedEvent.event.start)
        }

        this.setEventOnWeek("", addedIndex, ev.fromTime, ev.toTime, ev);
    }

    getSingleEvent(ev, i) {
        let event = {
            title: ev.title,
            start: ev.start,
            end: ev.end,
            allday: false,
            editable: false,
            custom: {
                date: ev.extendedProps.custom.date,
                fromTime: ev.extendedProps.custom.fromTime,
                toTime: ev.extendedProps.custom.toTime,
                type: 'dateEvent',
                slotType: 2,
                titleClass: 'slot-disabled'
            },
            id: ev.id
        };
        return event;
    }

    getPatternEvent(ev, i) {
        let event = {
            title: ev.title,
            start: ev.start,
            end: ev.end,
            allday: false,
            editable: false,
            id: ev.id,
            custom: {
                date: ev.extendedProps.custom.date,
                fromTime: ev.extendedProps.custom.fromTime,
                toTime: ev.extendedProps.custom.toTime,
                type: 'weekEvent',
                selectedWeekIndex: ev.extendedProps.custom.selectedWeekIndex,
                repeatedDays: ev.extendedProps.custom.repeatedDays,
                noOfWeek: ev.extendedProps.custom.noOfWeek,
                recurStart: ev.extendedProps.custom.recurStart,
                slotType: 0,
                titleClass: 'slot-disabled',
                originDate: ev.extendedProps.custom,
            }
        };
        return event;
    }

    /*getIndexOfRecurEvent(ev) {
        let recurStart = ev.recurStart.getTime();
        let idx = this.addedEvents.findIndex((aa) => {
            debugger;
            let tm = new Date(aa.startTime).getTime();
            return tm == recurStart && ev.selectedWeekIndex == aa.dayOfWeek
        });
        return idx;
    }*/

    getIndexOfSingleEvent(start) {
        start = start.getTime();
        let idx = this.addedEvents.findIndex((aa) => {
            let tm = new Date(aa.startTime).getTime();
            return tm == start && aa.dayOfWeek == -1
        });
        return idx;
    }



    onEventRender(info: any) {
        let title = info.el.find('.fc-title');
        title.html(title.text());
    }

    setEventOnWeek(i, addedIndex = -1, fromTime = "", toTime = "", selectedDate = { date: '', type: '', fromTime: '', toTime: '', selectedWeekIndex: '' }) {
        if (!this.isDateEventEditable) {
            return;
        }

        //this.selectedWeekIndex = i;
        //let evts = this.weekdays[this.selectedWeekIndex] ? this.weekdays[this.selectedWeekIndex].events : (this.eventOnDate[selectedDate.date] || {})
        const dialogRef = this.dialog.open(AvailabilityDialog, {
            maxWidth: '80vw',
            width: '50%',
            //height: '72%',
            panelClass: ["myClass"],
            data: { that: this, addedIndex: addedIndex, selectedDate: selectedDate, dialogText: "text", fromTime: fromTime, toTime: toTime }
        });

        const subscribeDialog = dialogRef.componentInstance.onSubmit.subscribe((data) => {
            this.newChange = true;
            let idx = data.addedIndex;
            debugger;
            this.selectedWeekIndex = data.selectedWeekIndex;
            if (this.selectedWeekIndex == -1) {
                let d = new Date(selectedDate.date);
                let id = selectedDate.date + "-" + data.fromTime + "-" + data.toTime;
                let oldId = selectedDate.date + "-" + data.oldFromTime + "-" + data.oldToTime;
                let oldEvent = this.calendarApi.getEventById(oldId);
                if (oldEvent) {
                    oldEvent.remove();
                }
                if (this.eventOnDate[selectedDate.date]) {
                    delete this.eventOnDate[selectedDate.date][data.oldFromTime + "-" + data.oldToTime];
                }
                data.startTime = new Date(selectedDate.date);
                data.endTime = new Date(selectedDate.date);
                data.startTime.setHours(data.fromHour, data.fromMinute, 0, 0)
                data.endTime.setHours(data.toHour, data.toMinute, 0, 0);

                if (data.selectedDate.type == 'weekEvent') {
                    this.storeDeletedEvent(data, d);
                }

                if (data.isDelete) {
                    if (data.selectedDate.type != 'weekEvent') {
                        this.addedEvents.splice(data.addedIndex, 1);

                    }
                    return false;
                }

                this.setSingleEvent(data, selectedDate.date, dialogRef)
                return;
            }
            let x, z, recurStart: any = '';
            //if (data.oldFromTime) {
            if (idx!= - 1) {
                debugger;
                x = new Date(this.addedEvents[idx]['startTime']);
                //x= new Date(data.recurStart);
                let currDate = new Date();
                if (x.getTime() < currDate.getTime()) { //Recur start less than current date than keep old date event
                    for (var kk = x; kk < currDate; kk.setDate(kk.getDate() + 7)) {
                        let startTime = new Date(kk);
                        let endTime = new Date(kk);
                        startTime.setHours(data.fromHour, data.fromMinute, 0, 0)
                        endTime.setHours(data.toHour, data.toMinute, 0, 0);

                        let obj = {
                            "title": data.fromTime + "-" + data.toTime,
                            "tutorId": this.tutorId,
                            "dayOfWeek": -1,
                            "specificDate": this.getEventTime(startTime),
                            "startTime": this.getEventTime(startTime),
                            "endTime": this.getEventTime(endTime),
                            "slotType": 2,
                            "slotDescription": "Test Put Method",
                        }
                        this.addedEvents.push(obj);
                        data.noOfWeek = data.noOfWeek - 1;
                    }
                    x = new Date();
                }
            } else {
                x = new Date(data.selectedDate.date);

            }
            data.selectedWeekIndex = parseInt(data.selectedWeekIndex);
            if (x.getDay() != data.selectedWeekIndex) {
                x.setDate(x.getDate() + (data.selectedWeekIndex + 7 - x.getDay()) % 7);
            }
            z = new Date();
            let duration = data.noOfWeek * 7;
            z.setTime(x.getTime() + (duration * 24 * 60 * 60 * 1000))
            let startTime = x;
            let endTime = z;
            startTime.setHours(data.fromHour, data.fromMinute, 0, 0)
            endTime.setHours(data.toHour, data.toMinute, 0, 0);
            let excludeDates = [];
            if (data.oldFromTime) {
                excludeDates = this.getExcludedDatePattern(data, startTime, endTime);
            } 
            if (data.excludedDatesInPattern) {
                data.excludedDatesInPattern.map((dm) => {
                    excludeDates.push(dm);
                    this.storeDeletedEventInPattern(data, dm, 'notDelete');
                });
            }
            
            if (!recurStart) {
                recurStart = new Date(x);
            }
            data.recurStart = recurStart;
            data.startTime = startTime;
            data.endTime = endTime;

            console.log(this.deletedEvents, 'deleteevent');
            console.log(excludeDates, 'excludeDates');

            this.setPatternEvent(x, z, excludeDates, data)
        });

    }

    storeDeletedEvent(data, d) {
        let startTime = new Date(data.selectedDate.date + "T" + data.oldFromTime);
        let endTime = new Date(data.selectedDate.date + "T" + data.oldToTime);
        this.deletedEvents.push({
            "title": data.oldFromTime + "-" + data.oldToTime,
            "tutorId": this.tutorId,
            "dayOfWeek": -1,
            "specificDate": d.toISOString(),
            "startTime": this.getEventTime(startTime),
            "endTime": this.getEventTime(endTime),
            "slotType": 1,
            "slotDescription": "Test Put Method"
        });
    }

    storeDeletedEventInPattern(data, date, action='') {
        let id = date + "-" + data.fromTime + "-" + data.toTime;
        let stTime = date + "T" + data.fromTime+":00";
        let edTime = date + "T" + data.toTime+":00"
        let startTime = new Date(stTime);
        let endTime = new Date(edTime);

        //let idx = this.deletedEvents.findIndex(de=>{
        //    return de.startTime==stTime && de.endTime==edTime;
        //});

        //if(idx!=-1){
        //    return; //Means Delete already there
        //}
        this.deletedEvents.push({
            "title": data.fromTime + "-" + data.toTime,
            "tutorId": this.tutorId,
            "dayOfWeek": -1,
            "specificDate": new Date(date).toISOString(),
            "startTime": this.getEventTime(startTime), 
            "endTime": this.getEventTime(endTime),
            "slotType": 1,
            "slotDescription": "Test Put Method"
        });

        if (this.eventOnDate[date] && this.eventOnDate[date][data.title] && action=='') {
            delete this.eventOnDate[date][data.title];
        }
        if (this.calendarApi.getEventById(id) && action == '') {
            this.calendarApi.getEventById(id).remove();

        }
    }

    getExcludedDatePattern(data, startTime, endTime) {
        let st = new Date(startTime).getTime();
        let et = new Date(endTime).getTime();
        let exDates = [];
        let remIndex = [];
        for (let i = 0; i < this.deletedEvents.length; i++) {
            let item = this.deletedEvents[i];
            let tt = new Date(item.startTime).getTime();
            if (item.title == data.oldFromTime + "-" + data.oldToTime && st <= tt && et >= tt) {
                if (data.isDelete) {
                    remIndex.push(i);
                } else {
                    exDates.push(item.startTime.split("T")[0]);
                    this.deletedEvents[i].startTime = this.deletedEvents[i].startTime.replace(data.oldFromTime, data.fromTime);
                    this.deletedEvents[i].title = data.fromTime + "-" + data.toTime;
                }
            }
        }

        for (let j = remIndex.length - 1; j >= 0; j--) {
            this.deletedEvents.splice(this.deletedEvents[j], 1);
        }

        return exDates;
    }

    setPatternEvent(x, z, excludeDates, data, dialogRef = null) {
        let promises = [];
        if (!data.isDelete) {
            if (data.addedIndex > -1) {
                this.addedEvents[data.addedIndex]['title'] = data.fromTime + "-" + data.toTime;
                this.addedEvents[data.addedIndex]['tutorId'] = this.tutorId;
                this.addedEvents[data.addedIndex]['dayOfWeek'] = data.selectedWeekIndex;
                this.addedEvents[data.addedIndex]['startTime'] = this.getEventTime(data.startTime);
                this.addedEvents[data.addedIndex]['endTime'] = this.getEventTime(data.endTime);
                this.addedEvents[data.addedIndex]['slotType'] = 0;
                this.addedEvents[data.addedIndex]['slotDescription'] = "Test Put Method";
                this.addedEvents[data.addedIndex]['noOfWeek'] = data.noOfWeek;
                this.addedEvents[data.addedIndex]['repeatedSlot'] = data.repeatedDays.join(',');

            } else {

                this.addedEvents.push({
                    "title": data.fromTime + "-" + data.toTime,
                    "tutorId": this.tutorId,
                    "dayOfWeek": data.selectedWeekIndex,
                    "startTime": this.getEventTime(data.startTime),
                    "endTime": this.getEventTime(data.endTime),
                    "slotType": 0,
                    "slotDescription": "Test Put Method",
                    "noOfWeek": data.noOfWeek,
                    "repeatedSlot": data.repeatedDays.join(','),
                    "originDate": data.originDate?data.originDate:data.selectedDate.date
                });


            }
        } else {
            this.addedEvents.splice(data.addedIndex, 1);

        }

        const pad = n => n < 10 ? '0' + n : n;
        let currUnixTime = new Date().getTime();
        
        for (let d = x; d < z; d.setDate(d.getDate() + 7)) {
            let dt = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
            if (excludeDates.includes(dt)) {
                continue;
            }
          
            if (data.intialRender) {
                let d2 = new Date(dt + 'T' + data.toTime + ':00');
                if (d2.getTime() < currUnixTime) {
                    continue;
                }
            }
            this.setWeekEvent(d, data);
        }

            if (dialogRef) {
                dialogRef.componentInstance.isSubmit = false;
            }
            this.calendarApi.render();
    }

    setSingleEvent(data, date, dialogRef = null, titleClass = '') { 
        let fromTime = data.fromTime;
        let toTime = data.toTime;
        let startTime = data.startTime;
        let endTime = data.endTime;
        let idx = data.addedIndex ? data.addedIndex : -1;
        let d = new Date(date);
        let id = date + "-" + data.fromTime + "-" + data.toTime;
        let serialNumber = 0;
        if (!titleClass) {
            titleClass = this.checkBookedSlot(date, data.fromTime);
        } else {
            if (!data.isDelete) {
                this.storeDeletedEventInPattern(data, date);
            }
            fromTime = data.oldFromTime;
            toTime = data.oldToTime;
            startTime = new Date(date + 'T' + fromTime);
            //endTime = new Date(d + 'T' + endTime);
            endTime = new Date(date + 'T' + toTime);
            id = date + "-" + data.oldFromTime + "-" + data.oldToTime;
        } 
        if (data.serialNumber) {
            serialNumber = data.serialNumber;
        }
        else if (titleClass == 'ava-slot slot-active' && this.isBookedSlotVisible) {
            ++this.settingCalendarBookedCount;
            serialNumber = this.settingCalendarBookedCount;
        }

        let event = {
            title: fromTime + "-" + toTime,
            start: startTime,
            end: endTime,
            allday: false,
            editable: false,
            custom: {
                date: d.toISOString().slice(0, 10),
                fromTime: fromTime,
                toTime: toTime,
                type: 'dateEvent',
                slotType: 2,
                titleClass: titleClass,
                serialNumber: serialNumber,
            },
            id: id
        };

        if (!this.eventOnDate[date]) {
            this.eventOnDate[date] = {};
            this.eventOnDate[date][event.title] = {
                from_time: fromTime,
                to_time: toTime
            };;
        } else {
            this.eventOnDate[date][event.title] = {
                from_time: fromTime,
                to_time: toTime
            };;
        }

        if (idx > -1 && data.selectedDate.type == 'dateEvent') {
            this.addedEvents[idx] = {
                "title": fromTime + "-" + toTime,
                "tutorId": this.tutorId,
                "dayOfWeek": -1,
                "specificDate": d.toISOString(),
                "startTime": this.getEventTime(startTime),
                "endTime": this.getEventTime(endTime),
                "slotType": 2,
                "slotDescription": "Test Put Method",
            }
        } else {
            this.addedEvents.push({
                "title": fromTime + "-" + toTime,
                "tutorId": this.tutorId,
                "dayOfWeek": -1,
                "specificDate": d.toISOString(),
                "startTime": this.getEventTime(startTime),
                "endTime": this.getEventTime(endTime),
                "slotType": 2,
                "slotDescription": "Test Put Method"
            });
        }

        if (titleClass) {
            let currEvent = this.calendarApi.getEventById(id);
            if (currEvent) {
                currEvent.remove();
            }
            this.calendarApi.addEvent(event);
            this.calendarApi.render();
        }
        
        if (dialogRef) {
            dialogRef.componentInstance.isSubmit = false;
        }
    }

      setWeekEvent(d, data) {

        let originDate;
        let date = d.toISOString().slice(0, 10);
        let titleClass = this.checkBookedSlot(date,data.fromTime);
        
        let id = date + "-" + data.fromTime + "-" + data.toTime;
        let oldId = date + "-" + data.oldFromTime + "-" + data.oldToTime;
        let oldEvent = this.calendarApi.getEventById(oldId);
        if (oldEvent) {
            if (oldEvent.extendedProps.custom.type != 'dateEvent') {
                originDate = oldEvent.extendedProps.custom.originDate;
                oldEvent.remove();
            }
        } else {
            originDate = data.originDate ? data.originDate : data.selectedDate.date;
        }
           
          if (this.eventOnDate[date] && titleClass == 'ava-slot') {
              if (oldEvent && oldEvent.extendedProps.custom.type != 'dateEvent') {
                  delete this.eventOnDate[date][data.oldFromTime + "-" + data.oldToTime];
              }
        }

          //if (oldEvent && oldEvent.extendedProps.custom.titleClass == 'ava-slot slot-active' && data.isDelete)
            //if (!data.intialRender && oldEvent && oldEvent.extendedProps.custom.titleClass == 'ava-slot slot-active'){
          if (!data.intialRender && oldEvent && ['ava-slot slot-active', 'slot-disabled'].includes(oldEvent.extendedProps.custom.titleClass)) {
            data.startTime = new Date(date + 'T' + data.fromTime)
            data.endTime = new Date(date + 'T' + data.toTime);

            let adIndex = this.getIndexOfSingleEvent(oldEvent.start);

            let currDate = new Date();
            if (data.startTime.getTime() >= currDate.getTime() && adIndex == -1) {
                data.serialNumber = oldEvent.extendedProps.custom.serialNumber;
                this.setSingleEvent(data, date, null, oldEvent.extendedProps.custom.titleClass);
            }

            let tt = data.fromTime + "-" + data.toTime;

            if (!this.eventOnDate[date]) {
                this.eventOnDate[date] = {};
                this.eventOnDate[date][tt] = {
                    from_time: data.fromTime,
                    to_time: data.toTime
                };
            } else {
                this.eventOnDate[date][tt] = {
                    from_time: data.fromTime,
                    to_time: data.toTime
                };
            }

            return;
        } 
        if (data.isDelete) {
            return;
        }

        let event = {
            title: data.fromTime + "-" + data.toTime,
            start: d.setHours(data.fromHour, data.fromMinute, 0, 0),
            end: d.setHours(data.toHour, data.toMinute, 0, 0),
            allday: false,
            editable: false,
            id: id,
            custom: {
                date: date,
                fromTime: data.fromTime,
                toTime: data.toTime,
                type: 'weekEvent',
                selectedWeekIndex: data.selectedWeekIndex,
                repeatedDays: data.repeatedDays,
                noOfWeek: data.noOfWeek,
                recurStart: data.recurStart,
                slotType: 0,
                titleClass: titleClass,
                serialNumber: (titleClass == 'ava-slot slot-active' && this.isBookedSlotVisible) ? ++this.settingCalendarBookedCount: 0,
                originDate: originDate
            }
        };
        if (!this.eventOnDate[date]) {
            this.eventOnDate[date] = {};
            this.eventOnDate[date][event.title] = {
                from_time: data.fromTime,
                to_time: data.toTime
            };
        } else {
            this.eventOnDate[date][event.title] = {
                from_time: data.fromTime,
                to_time: data.toTime
            };
        }
          if (titleClass) {
              let currEvent = this.calendarApi.getEventById(id);
              if (currEvent) {
                  currEvent.remove();
              }
            this.calendarApi.addEvent(event);
        }
    }

    getEventTime(d) {
        const pad = n => n < 10 ? '0' + n : n;
        return d.getFullYear() + '-'
            + pad(d.getMonth() + 1) + '-'
            + pad(d.getDate()) + 'T'
            + pad(d.getHours()) + ':'
            + pad(d.getMinutes()) + ':'
            + pad(d.getSeconds())
    }

    setAvailabilityEvents(event) {
        let slotType = {
            'Pattern': 0,
            'Deleted': 1,
            'Added': 2
        }
        const pad = n => n < 10 ? '0' + n : n;
        let daysObj = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        }
        let weekDayIndex = daysObj[event.dayOfWeek] >= 0 ? daysObj[event.dayOfWeek] : -1;
        let dataObj;
        if (weekDayIndex == -1) {
            let startTime = new Date(event.startTime);
            let endTime = new Date(event.endTime);
            let fromTime = pad(startTime.getHours()) + ":" + pad(startTime.getMinutes());
            let toTime = pad(endTime.getHours()) + ":" + pad(endTime.getMinutes());
            let data = {
                fromTime: fromTime,
                toTime: toTime,
                startTime: startTime,
                endTime: endTime
            }
            let dt = event.startTime.split("T")[0];
            if (slotType[event.slotType] == 1) {
                this.storeDeletedEventInPattern(data, dt)
                return;
            } else {
                this.setSingleEvent(data, dt, null)
            }
        } else {
            let stdate = event.startTime;

            let x = new Date(stdate);
            if (x.getDay() != weekDayIndex) {
                x.setDate(x.getDate() + (weekDayIndex + 7 - x.getDay()) % 7);
            }
            let recurStart = new Date(x);
            let duration = event.noOfWeek * 7;
            var z = new Date();
            z.setTime(x.getTime() + (duration * 24 * 60 * 60 * 1000))
            let startTime = new Date(event.startTime);
            let endTime = new Date(event.endTime);
            let excludeDates = [];
            let fromHour = startTime.getHours();
            let fromMinute = startTime.getMinutes();
            let toHour = endTime.getHours();
            let toMinute = endTime.getMinutes();
            let fromTime = pad(fromHour) + ":" + pad(fromMinute);
            let toTime = pad(toHour) + ":" + pad(toMinute);
            if (weekDayIndex == 5) {
                
            }
            let dt = event.startTime.split("T")[0];
            let data = {
                startTime: startTime,
                endTime: endTime,
                fromTime: fromTime,
                toTime: toTime,
                fromHour: fromHour,
                toHour: toHour,
                fromMinute: fromMinute,
                toMinute: toMinute,
                selectedWeekIndex: weekDayIndex,
                noOfWeek: event.noOfWeek,
                repeatedDays: event.repeatedSlot ? event.repeatedSlot.split(',') : [],
                recurStart: recurStart,
                originDate: event.originDate?event.originDate:dt,
                intialRender: true
            }
            this.setPatternEvent(x, z, excludeDates, data);
        }
    }

    showInformation() {
        const dialogRef = this.dialog.open(TutorInfoDialogComponent, {
            maxWidth: '46vw',
            panelClass: ["myInfoClass"],
            data: { type: 'CAL', page: this.fromSettingPage }
        });
    }

    makeBookedSlotObj() {
        let startTime;
        this.bookedSlotObj = {};
        if (this.bookedSlot) {
            this.bookedSlot.map(b => {
                startTime = b.startDate.split('+')[0];
                if (!this.bookedSlotObj[startTime]) {
                    this.bookedSlotObj[startTime] = {};
                }
                this.bookedSlotObj[startTime][b.courseId] = 1;
            });
        }
    }

    checkBookedSlot(dt, fromTime) {
        let titleClass = 'ava-slot';
        let date = dt + 'T' + fromTime + ":00";
        if (this.bookedSlot) {
            if (this.bookedSlotObj[date]) {
                titleClass = (this.bookedSlotObj[date][this.courseId] || this.isBookedSlotVisible) ? "ava-slot slot-active" :"slot-disabled";
            } else {
                titleClass = 'ava-slot';
            }
        }
        return titleClass;
    }

    addLessonButton() {
        let html = '<a href = "javascript:void(0)" style = "text-decoration: none;" > <span> +</span> Add a lesson by selecting a date/time on calendar </a>';
        $('.fc-toolbar-chunk:eq(1)').css({
            "margin-left": "20%",
            "margin-bottom": "2%"
        }).addClass('add-lesson mfs').html(html);
    }

    changeMonthNext(){
        debugger;
        let calendarApi = this.calendarComponent.getApi();
        let d = new Date(calendarApi.getDate());
        d.setMonth(d.getMonth() + 1);
        calendarApi.gotoDate(d.toISOString().split("T")[0]); // call a method on the Calendar object
    }
    changeMonthPre() {
        debugger;
        let calendarApi = this.calendarComponent.getApi();
        let d = new Date(calendarApi.getDate());
        d.setMonth(d.getMonth() - 1);
        calendarApi.gotoDate(d.toISOString().split("T")[0]); // call a method on the Calendar object
    }

}