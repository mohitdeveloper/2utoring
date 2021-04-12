"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalenderSchedulerComponent = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@fullcalendar/angular");
var daygrid_1 = require("@fullcalendar/daygrid");
var timegrid_1 = require("@fullcalendar/timegrid");
var interaction_1 = require("@fullcalendar/interaction");
var dialog_1 = require("@angular/material/dialog");
var availability_dialog_1 = require("./availability-dialog");
var tutor_info_dialog_component_1 = require("../tutor/tutors-index/tutor-info-dialog.component");
var ngx_toastr_1 = require("ngx-toastr");
var services_1 = require("../../services");
var CalenderSchedulerComponent = /** @class */ (function () {
    function CalenderSchedulerComponent(dialog, changeDetectorRef, toastr, coursesService) {
        this.dialog = dialog;
        this.changeDetectorRef = changeDetectorRef;
        this.toastr = toastr;
        this.coursesService = coursesService;
        this.isWeekVisible = true;
        this.isViewOnly = false;
        this.isDateEventEditable = true;
        this.isBookedSlotVisible = false;
        this.showAvailabilityPopup = true;
        this.getEventsOnSidebar = new core_1.EventEmitter();
        this.renderComplete = new core_1.EventEmitter();
        this.fromSettingPage = false;
        this.addedEvents = [];
        this.newChange = false;
        this.deletedEvents = [];
        this.eventOnDate = {};
        this.bookedSlotObj = {};
        this.clickedEvent = [];
        this.settingCalendarBookedCount = 0;
        this.calendarOptions = {
            initialView: 'dayGridMonth',
            editable: true,
            headerToolbar: {
                left: 'prev,title,next today',
                center: '',
                right: ''
            },
            dateClick: this.onDateClick.bind(this),
            eventClick: this.onEventClick.bind(this),
            //eventOrder: 'slotType',
            eventContent: function (arg) {
                var titleClass = arg.event.extendedProps.custom.titleClass ? arg.event.extendedProps.custom.titleClass : "ava-slot";
                var serialNumber = arg.event.extendedProps.custom.serialNumber ? arg.event.extendedProps.custom.serialNumber : '';
                var titleHtml = "<span class=\"" + titleClass + "\"><small>" + serialNumber + "</small>" + arg.event.title + "</span>";
                return { html: titleHtml };
            }
        };
        this.calendarEvents = [];
        this.calendarPlugins = [daygrid_1.default, timegrid_1.default, interaction_1.default];
        this.initialized = false;
    }
    CalenderSchedulerComponent.prototype.onResize = function (event) {
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
        }
        else {
            this.calendarApi.changeView('dayGridMonth');
        }
        this.calendarApi.render();
    };
    CalenderSchedulerComponent.prototype.getScreenSize = function (event) {
        var scrHeight = window.innerHeight;
        var scrWidth = window.innerWidth;
        console.log(scrHeight, scrWidth);
        if (scrWidth <= 1025) {
            setTimeout(function () {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
                $('#monthChangeButtons').css('display', 'block');
            }, 300);
        }
        else {
            $('#myOtherLessonView').css('display', 'none');
            //$('#monthChangeButtons').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (scrWidth >= 1350) {
            setTimeout(function () {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300);
        }
        if (scrWidth <= 768) {
            setTimeout(function () {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300);
        }
        else {
            setTimeout(function () {
                $('.fc-today-button').removeClass('col-12');
            }, 300);
        }
    };
    CalenderSchedulerComponent.prototype.ngOnInit = function () {
        this.getScreenSize();
    };
    CalenderSchedulerComponent.prototype.ngAfterViewChecked = function () {
        this.calendarApi = this.calendarComponent.getApi();
        if (this.calendarApi && !this.initialized) {
            this.initialized = true;
            this.loadTutorAllEvents();
        }
    };
    /*ngDoCheck(){
      ////;
      //this.changeDetectorRef.detectChanges();
      //this.calendarApi = this.calendarComponent.getApi();
      
    }*/
    CalenderSchedulerComponent.prototype.isMobile = function () { return ('ontouchstart' in document.documentElement); };
    CalenderSchedulerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        debugger;
        if (!this.calendarApi) {
            //return;
            this.changeDetectorRef.detectChanges();
            this.calendarApi = this.calendarComponent.getApi();
        }
        if (this.isMobile()) {
            //this.calendarOptions.initialView = 'timeGridDay';
            this.calendarApi.changeView('timeGridDay');
        }
        else {
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
            this.registerdEvents.map(function (r) {
                _this.setAvailabilityEvents(r);
            });
            if (this.deletedEvents) {
                this.deletedEvents.map(function (r) {
                    var dt = r.startTime.split("T")[0];
                    var did = dt + "-" + r.title;
                    var dEvent = _this.calendarApi.getEventById(did);
                    if (dEvent && dEvent.extendedProps.custom.type == 'weekEvent') {
                        dEvent.remove();
                        _this.calendarApi.render();
                    }
                });
            }
            debugger;
            this.renderComplete.emit();
        }
    };
    CalenderSchedulerComponent.prototype.ngAfterViewInit = function () { };
    CalenderSchedulerComponent.prototype.loadEvents = function () { };
    CalenderSchedulerComponent.prototype.loadTutorAllEvents = function () {
        var _this = this;
        if (!this.tutorEvents) {
            return;
        }
        this.tutorEvents.map(function (t) {
            var d = new Date(t.date);
            var _a = t.fromTime.split(":"), fromHour = _a[0], fromMinute = _a[1];
            var _b = t.toTime.split(":"), toHour = _b[0], toMinute = _b[1];
            fromHour = parseInt(fromHour);
            fromMinute = parseInt(fromMinute);
            toHour = parseInt(toHour);
            toMinute = parseInt(toMinute);
            var event = {
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
            _this.calendarApi.addEvent(event);
        });
    };
    CalenderSchedulerComponent.prototype.onDateClick = function (clickedDate) {
        if (!this.isDateEventEditable) {
            return;
        }
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        clickedDate.date.setHours(0, 0, 0, 0);
        if (d > clickedDate.date) {
            //alert('You can not add/edit event on previous dates');
            this.toastr.warning('You can not add/edit event on previous dates!');
            return;
        }
        var obj = { date: clickedDate.dateStr, type: '', fromTime: '', toTime: '', selectedWeekIndex: '' };
        this.setEventOnWeek("", -1, "", "", obj);
    };
    CalenderSchedulerComponent.prototype.onEventClick = function (clickedEvent) {
        var _this = this;
        if (this.isViewOnly) {
            return;
        }
        //if (clickedEvent.event.extendedProps.custom.titleClass == 'slot-disabled') {
        if (['slot-disabled', 'ava-slot slot-active'].includes(clickedEvent.event.extendedProps.custom.titleClass)) {
            this.toastr.error('Action not allowed', 'Prohibated');
            return;
        }
        var d1 = new Date();
        var d2 = new Date(clickedEvent.event.extendedProps.custom.date);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        if (d1 > d2) {
            //alert('You can not add/edit event on previous dates');
            this.toastr.warning('You can not add/edit event on previous dates!');
            return;
        }
        if (!this.isDateEventEditable) {
            var currTime = new Date().getTime();
            var slotStart = new Date(clickedEvent.event.start).getTime();
            if (slotStart < currTime) {
                this.toastr.warning('You can not choose this slot', 'Past Time');
                return;
            }
            var n = d1.getTimezoneOffset() * -1;
            var c1 = Math.floor(n / 60);
            c1 = (c1 < 10 ? '0' : '') + c1;
            //let offsetStr = c + ':' + n % 60;
            var ms = n % 60;
            ms = (ms < 10 ? '0' : '') + ms;
            var offsetStr = '+' + c1 + ':' + ms;
            var startDate = clickedEvent.event.extendedProps.custom.date + 'T' + clickedEvent.event.extendedProps.custom.fromTime + ":00" + offsetStr;
            var checkSlot = {
                ownerId: this.ownerId,
                startDate: startDate
            };
            this.coursesService.checkSlotAvailability(checkSlot).subscribe(function (success) {
                if (success) {
                    _this.getEventsOnSidebar.emit(clickedEvent);
                }
                else {
                    debugger;
                    var eventObj = void 0;
                    if (clickedEvent.event.extendedProps.custom.type == 'dateEvent') {
                        eventObj = _this.getSingleEvent(clickedEvent.event, 0);
                    }
                    else {
                        eventObj = _this.getPatternEvent(clickedEvent.event, 0);
                    }
                    clickedEvent.event.remove();
                    _this.calendarApi.addEvent(eventObj);
                    _this.calendarApi.render();
                    _this.toastr.warning('This slot is already selected,You can not choose this slot');
                }
            }, function (error) {
            });
            return;
        }
        ;
        var ev = clickedEvent.event.extendedProps.custom;
        if (ev.titleClass == 'ava-slot slot-active') {
            this.toastr.warning('You can not edit used slot!');
            return;
        }
        var addedIndex = -1;
        if (ev.type == 'weekEvent') {
            //addedIndex = this.getIndexOfRecurEvent(ev);
        }
        else {
            addedIndex = this.getIndexOfSingleEvent(clickedEvent.event.start);
        }
        this.setEventOnWeek("", addedIndex, ev.fromTime, ev.toTime, ev);
    };
    CalenderSchedulerComponent.prototype.getSingleEvent = function (ev, i) {
        var event = {
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
    };
    CalenderSchedulerComponent.prototype.getPatternEvent = function (ev, i) {
        var event = {
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
    };
    /*getIndexOfRecurEvent(ev) {
        let recurStart = ev.recurStart.getTime();
        let idx = this.addedEvents.findIndex((aa) => {
            debugger;
            let tm = new Date(aa.startTime).getTime();
            return tm == recurStart && ev.selectedWeekIndex == aa.dayOfWeek
        });
        return idx;
    }*/
    CalenderSchedulerComponent.prototype.getIndexOfSingleEvent = function (start) {
        start = start.getTime();
        var idx = this.addedEvents.findIndex(function (aa) {
            var tm = new Date(aa.startTime).getTime();
            return tm == start && aa.dayOfWeek == -1;
        });
        return idx;
    };
    CalenderSchedulerComponent.prototype.onEventRender = function (info) {
        var title = info.el.find('.fc-title');
        title.html(title.text());
    };
    CalenderSchedulerComponent.prototype.setEventOnWeek = function (i, addedIndex, fromTime, toTime, selectedDate) {
        var _this = this;
        if (addedIndex === void 0) { addedIndex = -1; }
        if (fromTime === void 0) { fromTime = ""; }
        if (toTime === void 0) { toTime = ""; }
        if (selectedDate === void 0) { selectedDate = { date: '', type: '', fromTime: '', toTime: '', selectedWeekIndex: '' }; }
        if (!this.isDateEventEditable) {
            return;
        }
        //this.selectedWeekIndex = i;
        //let evts = this.weekdays[this.selectedWeekIndex] ? this.weekdays[this.selectedWeekIndex].events : (this.eventOnDate[selectedDate.date] || {})
        var dialogRef = this.dialog.open(availability_dialog_1.AvailabilityDialog, {
            maxWidth: '80vw',
            width: '50%',
            //height: '72%',
            panelClass: ["myClass"],
            data: { that: this, addedIndex: addedIndex, selectedDate: selectedDate, dialogText: "text", fromTime: fromTime, toTime: toTime }
        });
        var subscribeDialog = dialogRef.componentInstance.onSubmit.subscribe(function (data) {
            _this.newChange = true;
            var idx = data.addedIndex;
            debugger;
            _this.selectedWeekIndex = data.selectedWeekIndex;
            if (_this.selectedWeekIndex == -1) {
                var d = new Date(selectedDate.date);
                var id = selectedDate.date + "-" + data.fromTime + "-" + data.toTime;
                var oldId = selectedDate.date + "-" + data.oldFromTime + "-" + data.oldToTime;
                var oldEvent = _this.calendarApi.getEventById(oldId);
                if (oldEvent) {
                    oldEvent.remove();
                }
                if (_this.eventOnDate[selectedDate.date]) {
                    delete _this.eventOnDate[selectedDate.date][data.oldFromTime + "-" + data.oldToTime];
                }
                data.startTime = new Date(selectedDate.date);
                data.endTime = new Date(selectedDate.date);
                data.startTime.setHours(data.fromHour, data.fromMinute, 0, 0);
                data.endTime.setHours(data.toHour, data.toMinute, 0, 0);
                if (data.selectedDate.type == 'weekEvent') {
                    _this.storeDeletedEvent(data, d);
                }
                if (data.isDelete) {
                    if (data.selectedDate.type != 'weekEvent') {
                        _this.addedEvents.splice(data.addedIndex, 1);
                    }
                    return false;
                }
                _this.setSingleEvent(data, selectedDate.date, dialogRef);
                return;
            }
            var x, z, recurStart = '';
            //if (data.oldFromTime) {
            if (idx != -1) {
                debugger;
                x = new Date(_this.addedEvents[idx]['startTime']);
                //x= new Date(data.recurStart);
                var currDate = new Date();
                if (x.getTime() < currDate.getTime()) { //Recur start less than current date than keep old date event
                    for (var kk = x; kk < currDate; kk.setDate(kk.getDate() + 7)) {
                        var startTime_1 = new Date(kk);
                        var endTime_1 = new Date(kk);
                        startTime_1.setHours(data.fromHour, data.fromMinute, 0, 0);
                        endTime_1.setHours(data.toHour, data.toMinute, 0, 0);
                        var obj = {
                            "title": data.fromTime + "-" + data.toTime,
                            "tutorId": _this.tutorId,
                            "dayOfWeek": -1,
                            "specificDate": _this.getEventTime(startTime_1),
                            "startTime": _this.getEventTime(startTime_1),
                            "endTime": _this.getEventTime(endTime_1),
                            "slotType": 2,
                            "slotDescription": "Test Put Method",
                        };
                        _this.addedEvents.push(obj);
                        data.noOfWeek = data.noOfWeek - 1;
                    }
                    x = new Date();
                }
            }
            else {
                x = new Date(data.selectedDate.date);
            }
            data.selectedWeekIndex = parseInt(data.selectedWeekIndex);
            if (x.getDay() != data.selectedWeekIndex) {
                x.setDate(x.getDate() + (data.selectedWeekIndex + 7 - x.getDay()) % 7);
            }
            z = new Date();
            var duration = data.noOfWeek * 7;
            z.setTime(x.getTime() + (duration * 24 * 60 * 60 * 1000));
            var startTime = x;
            var endTime = z;
            startTime.setHours(data.fromHour, data.fromMinute, 0, 0);
            endTime.setHours(data.toHour, data.toMinute, 0, 0);
            var excludeDates = [];
            if (data.oldFromTime) {
                excludeDates = _this.getExcludedDatePattern(data, startTime, endTime);
            }
            if (data.excludedDatesInPattern) {
                data.excludedDatesInPattern.map(function (dm) {
                    excludeDates.push(dm);
                    _this.storeDeletedEventInPattern(data, dm, 'notDelete');
                });
            }
            if (!recurStart) {
                recurStart = new Date(x);
            }
            data.recurStart = recurStart;
            data.startTime = startTime;
            data.endTime = endTime;
            console.log(_this.deletedEvents, 'deleteevent');
            console.log(excludeDates, 'excludeDates');
            _this.setPatternEvent(x, z, excludeDates, data);
        });
    };
    CalenderSchedulerComponent.prototype.storeDeletedEvent = function (data, d) {
        var startTime = new Date(data.selectedDate.date + "T" + data.oldFromTime);
        var endTime = new Date(data.selectedDate.date + "T" + data.oldToTime);
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
    };
    CalenderSchedulerComponent.prototype.storeDeletedEventInPattern = function (data, date, action) {
        if (action === void 0) { action = ''; }
        var id = date + "-" + data.fromTime + "-" + data.toTime;
        var stTime = date + "T" + data.fromTime + ":00";
        var edTime = date + "T" + data.toTime + ":00";
        var startTime = new Date(stTime);
        var endTime = new Date(edTime);
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
        if (this.eventOnDate[date] && this.eventOnDate[date][data.title] && action == '') {
            delete this.eventOnDate[date][data.title];
        }
        if (this.calendarApi.getEventById(id) && action == '') {
            this.calendarApi.getEventById(id).remove();
        }
    };
    CalenderSchedulerComponent.prototype.getExcludedDatePattern = function (data, startTime, endTime) {
        var st = new Date(startTime).getTime();
        var et = new Date(endTime).getTime();
        var exDates = [];
        var remIndex = [];
        for (var i = 0; i < this.deletedEvents.length; i++) {
            var item = this.deletedEvents[i];
            var tt = new Date(item.startTime).getTime();
            if (item.title == data.oldFromTime + "-" + data.oldToTime && st <= tt && et >= tt) {
                if (data.isDelete) {
                    remIndex.push(i);
                }
                else {
                    exDates.push(item.startTime.split("T")[0]);
                    this.deletedEvents[i].startTime = this.deletedEvents[i].startTime.replace(data.oldFromTime, data.fromTime);
                    this.deletedEvents[i].title = data.fromTime + "-" + data.toTime;
                }
            }
        }
        for (var j = remIndex.length - 1; j >= 0; j--) {
            this.deletedEvents.splice(this.deletedEvents[j], 1);
        }
        return exDates;
    };
    CalenderSchedulerComponent.prototype.setPatternEvent = function (x, z, excludeDates, data, dialogRef) {
        if (dialogRef === void 0) { dialogRef = null; }
        var promises = [];
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
            }
            else {
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
                    "originDate": data.originDate ? data.originDate : data.selectedDate.date
                });
            }
        }
        else {
            this.addedEvents.splice(data.addedIndex, 1);
        }
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var currUnixTime = new Date().getTime();
        for (var d = x; d < z; d.setDate(d.getDate() + 7)) {
            var dt = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
            if (excludeDates.includes(dt)) {
                continue;
            }
            if (data.intialRender) {
                var d2 = new Date(dt + 'T' + data.toTime + ':00');
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
    };
    CalenderSchedulerComponent.prototype.setSingleEvent = function (data, date, dialogRef, titleClass) {
        if (dialogRef === void 0) { dialogRef = null; }
        if (titleClass === void 0) { titleClass = ''; }
        var fromTime = data.fromTime;
        var toTime = data.toTime;
        var startTime = data.startTime;
        var endTime = data.endTime;
        var idx = data.addedIndex ? data.addedIndex : -1;
        var d = new Date(date);
        var id = date + "-" + data.fromTime + "-" + data.toTime;
        var serialNumber = 0;
        if (!titleClass) {
            titleClass = this.checkBookedSlot(date, data.fromTime);
        }
        else {
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
        var event = {
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
            };
            ;
        }
        else {
            this.eventOnDate[date][event.title] = {
                from_time: fromTime,
                to_time: toTime
            };
            ;
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
            };
        }
        else {
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
            var currEvent = this.calendarApi.getEventById(id);
            if (currEvent) {
                currEvent.remove();
            }
            this.calendarApi.addEvent(event);
            this.calendarApi.render();
        }
        if (dialogRef) {
            dialogRef.componentInstance.isSubmit = false;
        }
    };
    CalenderSchedulerComponent.prototype.setWeekEvent = function (d, data) {
        var originDate;
        var date = d.toISOString().slice(0, 10);
        var titleClass = this.checkBookedSlot(date, data.fromTime);
        var id = date + "-" + data.fromTime + "-" + data.toTime;
        var oldId = date + "-" + data.oldFromTime + "-" + data.oldToTime;
        var oldEvent = this.calendarApi.getEventById(oldId);
        if (oldEvent) {
            if (oldEvent.extendedProps.custom.type != 'dateEvent') {
                originDate = oldEvent.extendedProps.custom.originDate;
                oldEvent.remove();
            }
        }
        else {
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
            data.startTime = new Date(date + 'T' + data.fromTime);
            data.endTime = new Date(date + 'T' + data.toTime);
            var adIndex = this.getIndexOfSingleEvent(oldEvent.start);
            var currDate = new Date();
            if (data.startTime.getTime() >= currDate.getTime() && adIndex == -1) {
                data.serialNumber = oldEvent.extendedProps.custom.serialNumber;
                this.setSingleEvent(data, date, null, oldEvent.extendedProps.custom.titleClass);
            }
            var tt = data.fromTime + "-" + data.toTime;
            if (!this.eventOnDate[date]) {
                this.eventOnDate[date] = {};
                this.eventOnDate[date][tt] = {
                    from_time: data.fromTime,
                    to_time: data.toTime
                };
            }
            else {
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
        var event = {
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
                serialNumber: (titleClass == 'ava-slot slot-active' && this.isBookedSlotVisible) ? ++this.settingCalendarBookedCount : 0,
                originDate: originDate
            }
        };
        if (!this.eventOnDate[date]) {
            this.eventOnDate[date] = {};
            this.eventOnDate[date][event.title] = {
                from_time: data.fromTime,
                to_time: data.toTime
            };
        }
        else {
            this.eventOnDate[date][event.title] = {
                from_time: data.fromTime,
                to_time: data.toTime
            };
        }
        if (titleClass) {
            var currEvent = this.calendarApi.getEventById(id);
            if (currEvent) {
                currEvent.remove();
            }
            this.calendarApi.addEvent(event);
        }
    };
    CalenderSchedulerComponent.prototype.getEventTime = function (d) {
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        return d.getFullYear() + '-'
            + pad(d.getMonth() + 1) + '-'
            + pad(d.getDate()) + 'T'
            + pad(d.getHours()) + ':'
            + pad(d.getMinutes()) + ':'
            + pad(d.getSeconds());
    };
    CalenderSchedulerComponent.prototype.setAvailabilityEvents = function (event) {
        var slotType = {
            'Pattern': 0,
            'Deleted': 1,
            'Added': 2
        };
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var daysObj = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        };
        var weekDayIndex = daysObj[event.dayOfWeek] >= 0 ? daysObj[event.dayOfWeek] : -1;
        var dataObj;
        if (weekDayIndex == -1) {
            var startTime = new Date(event.startTime);
            var endTime = new Date(event.endTime);
            var fromTime = pad(startTime.getHours()) + ":" + pad(startTime.getMinutes());
            var toTime = pad(endTime.getHours()) + ":" + pad(endTime.getMinutes());
            var data = {
                fromTime: fromTime,
                toTime: toTime,
                startTime: startTime,
                endTime: endTime
            };
            var dt = event.startTime.split("T")[0];
            if (slotType[event.slotType] == 1) {
                this.storeDeletedEventInPattern(data, dt);
                return;
            }
            else {
                this.setSingleEvent(data, dt, null);
            }
        }
        else {
            var stdate = event.startTime;
            var x = new Date(stdate);
            if (x.getDay() != weekDayIndex) {
                x.setDate(x.getDate() + (weekDayIndex + 7 - x.getDay()) % 7);
            }
            var recurStart = new Date(x);
            var duration = event.noOfWeek * 7;
            var z = new Date();
            z.setTime(x.getTime() + (duration * 24 * 60 * 60 * 1000));
            var startTime = new Date(event.startTime);
            var endTime = new Date(event.endTime);
            var excludeDates = [];
            var fromHour = startTime.getHours();
            var fromMinute = startTime.getMinutes();
            var toHour = endTime.getHours();
            var toMinute = endTime.getMinutes();
            var fromTime = pad(fromHour) + ":" + pad(fromMinute);
            var toTime = pad(toHour) + ":" + pad(toMinute);
            if (weekDayIndex == 5) {
            }
            var dt = event.startTime.split("T")[0];
            var data = {
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
                originDate: event.originDate ? event.originDate : dt,
                intialRender: true
            };
            this.setPatternEvent(x, z, excludeDates, data);
        }
    };
    CalenderSchedulerComponent.prototype.showInformation = function () {
        var dialogRef = this.dialog.open(tutor_info_dialog_component_1.TutorInfoDialogComponent, {
            maxWidth: '46vw',
            panelClass: ["myInfoClass"],
            data: { type: 'CAL', page: this.fromSettingPage }
        });
    };
    CalenderSchedulerComponent.prototype.makeBookedSlotObj = function () {
        var _this = this;
        var startTime;
        this.bookedSlotObj = {};
        if (this.bookedSlot) {
            this.bookedSlot.map(function (b) {
                startTime = b.startDate.split('+')[0];
                if (!_this.bookedSlotObj[startTime]) {
                    _this.bookedSlotObj[startTime] = {};
                }
                _this.bookedSlotObj[startTime][b.courseId] = 1;
            });
        }
    };
    CalenderSchedulerComponent.prototype.checkBookedSlot = function (dt, fromTime) {
        var titleClass = 'ava-slot';
        var date = dt + 'T' + fromTime + ":00";
        if (this.bookedSlot) {
            if (this.bookedSlotObj[date]) {
                titleClass = (this.bookedSlotObj[date][this.courseId] || this.isBookedSlotVisible) ? "ava-slot slot-active" : "slot-disabled";
            }
            else {
                titleClass = 'ava-slot';
            }
        }
        return titleClass;
    };
    CalenderSchedulerComponent.prototype.addLessonButton = function () {
        var html = '<a href = "javascript:void(0)" style = "text-decoration: none;" > <span> +</span> Add a lesson by selecting a date/time on calendar </a>';
        $('.fc-toolbar-chunk:eq(1)').css({
            "margin-left": "20%",
            "margin-bottom": "2%"
        }).addClass('add-lesson mfs').html(html);
    };
    CalenderSchedulerComponent.prototype.changeMonthNext = function () {
        debugger;
        var calendarApi = this.calendarComponent.getApi();
        var d = new Date(calendarApi.getDate());
        d.setMonth(d.getMonth() + 1);
        calendarApi.gotoDate(d.toISOString().split("T")[0]); // call a method on the Calendar object
    };
    CalenderSchedulerComponent.prototype.changeMonthPre = function () {
        debugger;
        var calendarApi = this.calendarComponent.getApi();
        var d = new Date(calendarApi.getDate());
        d.setMonth(d.getMonth() - 1);
        calendarApi.gotoDate(d.toISOString().split("T")[0]); // call a method on the Calendar object
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderSchedulerComponent.prototype, "isWeekVisible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderSchedulerComponent.prototype, "isViewOnly", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "tutorEvents", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "tutorId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "registerdEvents", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderSchedulerComponent.prototype, "isDateEventEditable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "bookedSlot", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderSchedulerComponent.prototype, "isBookedSlotVisible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderSchedulerComponent.prototype, "showAvailabilityPopup", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "courseId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "ownerId", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "getEventsOnSidebar", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CalenderSchedulerComponent.prototype, "renderComplete", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderSchedulerComponent.prototype, "fromSettingPage", void 0);
    __decorate([
        core_1.ViewChild('fullcalendar'),
        __metadata("design:type", angular_1.FullCalendarComponent)
    ], CalenderSchedulerComponent.prototype, "calendarComponent", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CalenderSchedulerComponent.prototype, "onResize", null);
    CalenderSchedulerComponent = __decorate([
        core_1.Component({
            selector: 'app-calender-scheduler',
            templateUrl: './calender-scheduler.component.html',
            styleUrls: ['./calender-scheduler.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, core_1.ChangeDetectorRef, ngx_toastr_1.ToastrService, services_1.CoursesService])
    ], CalenderSchedulerComponent);
    return CalenderSchedulerComponent;
}());
exports.CalenderSchedulerComponent = CalenderSchedulerComponent;
//# sourceMappingURL=calender-scheduler.component.js.map