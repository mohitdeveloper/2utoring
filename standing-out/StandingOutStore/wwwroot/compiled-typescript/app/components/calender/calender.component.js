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
exports.CalenderComponent = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@fullcalendar/angular");
var daygrid_1 = require("@fullcalendar/daygrid");
var timegrid_1 = require("@fullcalendar/timegrid");
var interaction_1 = require("@fullcalendar/interaction");
var dialog_1 = require("@angular/material/dialog");
var dialog_content_example_1 = require("./dialog-content-example");
var tutor_info_dialog_component_1 = require("../tutor/tutors-index/tutor-info-dialog.component");
var CalenderComponent = /** @class */ (function () {
    function CalenderComponent(dialog, changeDetectorRef) {
        this.dialog = dialog;
        this.changeDetectorRef = changeDetectorRef;
        this.isWeekVisible = true;
        this.isViewOnly = false;
        this.isDateEventEditable = true;
        this.getEventsOnSidebar = new core_1.EventEmitter();
        this.addedEvents = [];
        this.deletedEvents = [];
        this.eventOnDate = {};
        this.clickedEvent = [];
        this.weekdays = [
            {
                dayName: 'Sunday',
                events: []
            },
            {
                dayName: 'Monday',
                events: []
            },
            {
                dayName: 'Tuesday',
                events: []
            },
            {
                dayName: 'Wednesday',
                events: []
            },
            {
                dayName: 'Thursday',
                events: []
            },
            {
                dayName: 'Friday',
                events: []
            },
            {
                dayName: 'Saturday',
                events: []
            }
        ];
        this.calendarOptions = {
            initialView: 'dayGridMonth',
            editable: true,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            dateClick: this.onDateClick.bind(this),
            eventClick: this.onEventClick.bind(this),
            eventContent: function (arg) {
                var titleClass = arg.event.extendedProps.custom.titleClass ? arg.event.extendedProps.custom.titleClass : "fc-daygrid-event-dot-green";
                var titleHtml = "\n      <div class=\"" + titleClass + "\"></div>\n      <div class=\"fc-event-title\">" + arg.event.title + "\n      </div>\n      ";
                return { html: titleHtml };
            }
        };
        this.calendarEvents = [];
        this.calendarPlugins = [daygrid_1.default, timegrid_1.default, interaction_1.default];
        this.initialized = false;
    }
    CalenderComponent.prototype.ngOnInit = function () {
    };
    CalenderComponent.prototype.ngAfterViewChecked = function () {
        this.calendarApi = this.calendarComponent.getApi();
        if (this.calendarApi && !this.initialized) {
            this.initialized = true;
            this.loadTutorAllEvents();
        }
    };
    /*ngDoCheck(){
      ////debugger;
      //this.changeDetectorRef.detectChanges();
      //this.calendarApi = this.calendarComponent.getApi();
      
    }*/
    CalenderComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        //debugger;
        if (!this.calendarApi) {
            //return;
            this.changeDetectorRef.detectChanges();
            this.calendarApi = this.calendarComponent.getApi();
        }
        this.calendarApi.removeAllEvents();
        if (this.tutorEvents) {
            this.loadTutorAllEvents();
        }
        if (this.registerdEvents) {
            this.addedEvents = [];
            this.eventOnDate = {};
            this.weekdays = [
                {
                    dayName: 'Sunday',
                    events: []
                },
                {
                    dayName: 'Monday',
                    events: []
                },
                {
                    dayName: 'Tuesday',
                    events: []
                },
                {
                    dayName: 'Wednesday',
                    events: []
                },
                {
                    dayName: 'Thursday',
                    events: []
                },
                {
                    dayName: 'Friday',
                    events: []
                },
                {
                    dayName: 'Saturday',
                    events: []
                }
            ];
            this.registerdEvents.map(function (r) {
                _this.setAvailabilityEvents(r);
            });
        }
    };
    CalenderComponent.prototype.ngAfterViewInit = function () { };
    CalenderComponent.prototype.loadEvents = function () { };
    CalenderComponent.prototype.loadTutorAllEvents = function () {
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
    CalenderComponent.prototype.onDateClick = function (clickedDate) {
        //debugger;
        if (!this.isDateEventEditable) {
            return;
        }
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        clickedDate.date.setHours(0, 0, 0, 0);
        if (d > clickedDate.date) {
            alert('You can not add/edit event on previous dates');
            return;
        }
        var obj = { date: clickedDate.dateStr, type: '', fromTime: '', toTime: '', selectedWeekIndex: '' };
        this.setEventOnWeek("", -1, "", "", obj);
    };
    CalenderComponent.prototype.onEventClick = function (clickedEvent) {
        if (this.isViewOnly) {
            return;
        }
        if (!this.isDateEventEditable) {
            var d1 = new Date();
            var d2 = new Date(clickedEvent.event.extendedProps.custom.date);
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
            if (d1 > d2) {
                alert('You can not add/edit event on previous dates');
                return;
            }
            this.getEventsOnSidebar.emit(clickedEvent);
            return;
        }
        var ev = clickedEvent.event.extendedProps.custom;
        this.setEventOnWeek("", -1, ev.fromTime, ev.toTime, ev);
    };
    CalenderComponent.prototype.onEventRender = function (info) {
        var title = info.el.find('.fc-title');
        title.html(title.text());
    };
    CalenderComponent.prototype.setEventOnWeek = function (i, slotIndex, fromTime, toTime, selectedDate) {
        var _this = this;
        if (slotIndex === void 0) { slotIndex = -1; }
        if (fromTime === void 0) { fromTime = ""; }
        if (toTime === void 0) { toTime = ""; }
        if (selectedDate === void 0) { selectedDate = { date: '', type: '', fromTime: '', toTime: '', selectedWeekIndex: '' }; }
        if (!this.isDateEventEditable) {
            return;
        }
        this.selectedWeekIndex = i;
        var evts = this.weekdays[this.selectedWeekIndex] ? this.weekdays[this.selectedWeekIndex].events : (this.eventOnDate[selectedDate.date] || {});
        var dialogRef = this.dialog.open(dialog_content_example_1.DialogContentExampleDialog, {
            width: '350px',
            data: { selectedWeekIndex: i, events: evts, slotIndex: slotIndex, selectedDate: selectedDate, selectedWeekDay: this.weekdays[i] ? this.weekdays[i].dayName : "", dialogText: "text", fromTime: fromTime, toTime: toTime }
        });
        var subscribeDialog = dialogRef.componentInstance.onSubmit.subscribe(function (data) {
            if (_this.selectedWeekIndex === "") {
                var idx_1 = _this.addedEvents.findIndex(function (item) {
                    var dt = item.startTime.split("T")[0];
                    return (dt == selectedDate.date) && item.title == (data.oldFromTime + "-" + data.oldToTime) && item.dayOfWeek == -1;
                });
                var d_1 = new Date(selectedDate.date);
                var id = selectedDate.date + "-" + data.fromTime + "-" + data.toTime;
                var oldId = selectedDate.date + "-" + data.oldFromTime + "-" + data.oldToTime;
                var oldEvent = _this.calendarApi.getEventById(oldId);
                if (oldEvent) {
                    oldEvent.remove();
                }
                if (_this.eventOnDate[selectedDate.date]) {
                    delete _this.eventOnDate[selectedDate.date][data.oldFromTime + "-" + data.oldToTime];
                }
                var startTime_1 = new Date(selectedDate.date);
                var endTime_1 = new Date(selectedDate.date);
                startTime_1.setHours(data.fromHour, data.fromMinute, 0, 0);
                endTime_1.setHours(data.toHour, data.toMinute, 0, 0);
                if (data.isDelete) {
                    //debugger;
                    if (oldEvent.extendedProps.custom.type == 'weekEvent') {
                        _this.deletedEvents.push({
                            "title": data.fromTime + "-" + data.toTime,
                            "tutorId": _this.tutorId,
                            "dayOfWeek": -1,
                            "specificDate": d_1.toISOString(),
                            "startTime": _this.getEventTime(startTime_1),
                            "endTime": _this.getEventTime(endTime_1),
                            "slotType": 2,
                            "slotDescription": "Test Put Method"
                        });
                    }
                    if (idx_1 != -1) {
                        _this.addedEvents.splice(idx_1, 1);
                    }
                    return false;
                }
                var didx = _this.deletedEvents.findIndex(function (item) {
                    return item.startTime == selectedDate.date + "T" + data.fromTime + ":00";
                });
                if (didx != -1) {
                    _this.deletedEvents.splice(didx, 1);
                }
                var event_1 = {
                    title: data.fromTime + "-" + data.toTime,
                    start: d_1.setHours(data.fromHour, data.fromMinute, 0, 0),
                    end: d_1.setHours(data.toHour, data.toMinute, 0, 0),
                    allday: false,
                    editable: false,
                    custom: {
                        date: d_1.toISOString().slice(0, 10),
                        fromTime: data.fromTime,
                        toTime: data.toTime,
                        type: 'dateEvent',
                    },
                    id: id
                };
                if (!_this.eventOnDate[selectedDate.date]) {
                    _this.eventOnDate[selectedDate.date] = {};
                    _this.eventOnDate[selectedDate.date][event_1.title] = {
                        from_time: data.fromTime,
                        to_time: data.toTime
                    };
                    ;
                }
                else {
                    _this.eventOnDate[selectedDate.date][event_1.title] = {
                        from_time: data.fromTime,
                        to_time: data.toTime
                    };
                    ;
                }
                if (idx_1 > -1) {
                    _this.addedEvents[idx_1] = {
                        "title": data.fromTime + "-" + data.toTime,
                        "tutorId": _this.tutorId,
                        "dayOfWeek": -1,
                        "specificDate": d_1.toISOString(),
                        "startTime": _this.getEventTime(startTime_1),
                        "endTime": _this.getEventTime(endTime_1),
                        "slotType": 1,
                        "slotDescription": "Test Put Method"
                    };
                }
                else {
                    _this.addedEvents.push({
                        "title": data.fromTime + "-" + data.toTime,
                        "tutorId": _this.tutorId,
                        "dayOfWeek": -1,
                        "specificDate": d_1.toISOString(),
                        "startTime": _this.getEventTime(startTime_1),
                        "endTime": _this.getEventTime(endTime_1),
                        "slotType": 1,
                        "slotDescription": "Test Put Method"
                    });
                }
                console.log("Event", event_1);
                _this.calendarApi.addEvent(event_1);
                _this.calendarApi.render();
                dialogRef.componentInstance.isSubmit = false;
                return;
            }
            var idx = _this.addedEvents.findIndex(function (item) {
                return item.dayOfWeek == _this.selectedWeekIndex && item.title == (data.oldFromTime + "-" + data.oldToTime);
            });
            var startTime = new Date();
            var endTime = new Date();
            startTime.setHours(data.fromHour, data.fromMinute, 0, 0);
            endTime.setHours(data.toHour, data.toMinute, 0, 0);
            ////debugger;
            if (!data.isDelete) {
                if (idx > -1) {
                    _this.addedEvents[idx] = {
                        "title": data.fromTime + "-" + data.toTime,
                        "tutorId": _this.tutorId,
                        "dayOfWeek": _this.selectedWeekIndex,
                        "startTime": _this.getEventTime(startTime),
                        "endTime": _this.getEventTime(endTime),
                        "slotType": 0,
                        "slotDescription": "Test Put Method"
                    };
                }
                else {
                    _this.addedEvents.push({
                        "title": data.fromTime + "-" + data.toTime,
                        "tutorId": _this.tutorId,
                        "dayOfWeek": _this.selectedWeekIndex,
                        "startTime": _this.getEventTime(startTime),
                        "endTime": _this.getEventTime(endTime),
                        "slotType": 0,
                        "slotDescription": "Test Put Method"
                    });
                }
                if (data.slotIndex >= 0) {
                    _this.weekdays[_this.selectedWeekIndex].events[slotIndex] = {
                        from_time: data.fromTime,
                        to_time: data.toTime,
                        sortKey: data.fromHour + data.fromMinute * 0.1
                    };
                }
                else {
                    _this.weekdays[_this.selectedWeekIndex].events.push({
                        from_time: data.fromTime,
                        to_time: data.toTime,
                        sortKey: data.fromHour + data.fromMinute * 0.1
                    });
                }
                _this.weekdays[_this.selectedWeekIndex].events.sort(function (a, b) {
                    return a.sortKey - b.sortKey;
                });
            }
            else {
                _this.addedEvents.splice(idx, 1);
                _this.weekdays[_this.selectedWeekIndex].events.splice(data.slotIndex, 1);
            }
            var promises = [];
            var x = new Date();
            var z = new Date();
            z.setMonth(x.getMonth() + 13);
            z.setDate(0);
            if (data.oldFromTime) {
                /*let ff = {
                  title: data.oldFromTime + "-" + data.oldToTime,
                  groupId: this.selectedWeekIndex + "-" + data.oldFromTime + "-" + data.oldToTime,
                  //daysOfWeek: ['5'],
                  daysOfWeek: [this.selectedWeekIndex],
                  startRecur: x,
                  endRecur: z,
                  allday: true
                }
                this.calendarApi.removeEvents(ff);*/
            }
            var dayC;
            if (x.getDay() > _this.selectedWeekIndex) {
                dayC = 7 - x.getDay() + _this.selectedWeekIndex;
            }
            else {
                dayC = _this.selectedWeekIndex - x.getDay();
            }
            x.setDate(x.getDate() + dayC);
            for (var d = x; d <= z; d.setDate(d.getDate() + 7)) {
                console.log("Dates", d);
                promises.push(_this.setWeekEvent(d, data, _this.selectedWeekIndex));
            }
            Promise.all(promises).then(function (resp) {
                dialogRef.componentInstance.isSubmit = false;
                _this.calendarApi.render();
            });
        });
    };
    CalenderComponent.prototype.setWeekEvent = function (d, data, selectedWeekIndex) {
        var date = d.toISOString().slice(0, 10);
        var id = date + "-" + data.fromTime + "-" + data.toTime;
        var oldId = date + "-" + data.oldFromTime + "-" + data.oldToTime;
        var oldEvent = this.calendarApi.getEventById(oldId);
        var currEvent = this.calendarApi.getEventById(id);
        if (oldEvent) {
            oldEvent.remove();
        }
        if (this.eventOnDate[date]) {
            delete this.eventOnDate[date][data.oldFromTime + "-" + data.oldToTime];
        }
        if (data.isDelete) {
            return;
        }
        if (currEvent) {
            currEvent.remove();
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
                selectedWeekIndex: selectedWeekIndex,
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
        this.calendarApi.addEvent(event);
    };
    CalenderComponent.prototype.editWeekTimeSlot = function (event, i, slotIndex, from_time, to_time) {
        event.stopPropagation();
        if (!this.isDateEventEditable) {
            return;
        }
        this.setEventOnWeek(i, slotIndex, from_time, to_time);
    };
    CalenderComponent.prototype.updateEvent = function () {
        /*let ff = {
          groupId: 'blueEvents', // recurrent events in this group move together
            //daysOfWeek: ['5'],
            daysOfWeek: [5, 6],
              startRecur: new Date("2020-09-10"),
                endRecur: new Date("2020-09-20"),
                  allday: true
        }
        this.calendarApi.removeAllEvents(ff);*/
    };
    CalenderComponent.prototype.getEventTime = function (d) {
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        return d.getFullYear() + '-'
            + pad(d.getMonth() + 1) + '-'
            + pad(d.getDate()) + 'T'
            + pad(d.getHours()) + ':'
            + pad(d.getMinutes()) + ':'
            + pad(d.getSeconds()) + 'Z';
    };
    CalenderComponent.prototype.setAvailabilityEvents = function (event) {
        var _this = this;
        var slotType = {
            'Pattern': 0,
            'Added': 1,
            'Deleted': 2
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
            var fromTime_1 = pad(startTime.getHours()) + ":" + pad(startTime.getMinutes());
            var toTime = pad(endTime.getHours()) + ":" + pad(endTime.getMinutes());
            var id = event.startTime.split("T")[0] + '-' + fromTime_1 + "-" + toTime;
            dataObj = {
                "title": fromTime_1 + "-" + toTime,
                "tutorId": this.tutorId,
                "dayOfWeek": -1,
                "specificDate": event.startTime,
                "startTime": event.startTime,
                "endTime": event.endTime,
                "slotType": slotType[event.slotType],
                "slotDescription": "Test Put Method"
            };
            if (slotType[event.slotType] == 2) {
                this.deletedEvents.push(dataObj);
                if (this.eventOnDate[event.startTime.split("T")[0]] && this.eventOnDate[event.startTime.split("T")[0]][dataObj.title]) {
                    delete this.eventOnDate[event.startTime.split("T")[0]][dataObj.title];
                }
                if (this.calendarApi.getEventById(id)) {
                    this.calendarApi.getEventById(id).remove();
                }
                return;
            }
            var dt_1 = event.startTime.split("T")[0];
            if (this.bookedSlot) {
                var checkSlot = this.bookedSlot.some(function (b) {
                    if (b.startDate.split('+')[0] == (dt_1 + 'T' + fromTime_1 + ":00")) {
                        return true;
                    }
                });
                if (checkSlot) {
                    return;
                }
            }
            var eventObj = {
                title: fromTime_1 + "-" + toTime,
                start: startTime,
                end: endTime,
                allday: false,
                editable: false,
                custom: {
                    date: dt_1,
                    fromTime: fromTime_1,
                    toTime: toTime,
                    type: 'dateEvent',
                },
                id: id
            };
            if (!this.eventOnDate[dt_1]) {
                this.eventOnDate[dt_1] = {};
                this.eventOnDate[dt_1][eventObj.title] = {
                    from_time: fromTime_1,
                    to_time: toTime
                };
                ;
            }
            else {
                this.eventOnDate[dt_1][eventObj.title] = {
                    from_time: fromTime_1,
                    to_time: toTime
                };
                ;
            }
            if (!this.calendarApi.getEventById(id)) {
                this.calendarApi.addEvent(eventObj);
            }
        }
        else {
            var stdate = event.createdDate.split("T")[0];
            var x = new Date(stdate);
            var dayC = void 0;
            if (x.getDay() > weekDayIndex) {
                dayC = 7 - x.getDay() + weekDayIndex;
            }
            else {
                dayC = weekDayIndex - x.getDay();
            }
            x.setDate(x.getDate() + dayC);
            var z = new Date(x.getFullYear(), x.getMonth() + 1, 0);
            var startTime = new Date(event.startTime);
            var endTime = new Date(event.endTime);
            var fromHour = startTime.getHours();
            var fromMinute = startTime.getMinutes();
            var toHour = endTime.getHours();
            var toMinute = endTime.getMinutes();
            var fromTime_2 = pad(fromHour) + ":" + pad(fromMinute);
            var toTime = pad(toHour) + ":" + pad(toMinute);
            dataObj = {
                "title": fromTime_2 + "-" + toTime,
                "tutorId": this.tutorId,
                "dayOfWeek": weekDayIndex,
                "startTime": event.startTime,
                "endTime": event.endTime,
                "slotType": slotType[event.slotType],
                "slotDescription": "Test Put Method"
            };
            this.weekdays[weekDayIndex].events.push({
                from_time: fromTime_2,
                to_time: toTime
            });
            var _loop_1 = function (d) {
                var dt = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
                var id = dt + '-' + fromTime_2 + "-" + toTime;
                //console.log("Id",id);
                var titleClass = "fc-daygrid-event-dot-green";
                if (this_1.bookedSlot) {
                    //if(dt=="2020-09-27"){
                    // debugger;
                    // }
                    var cCount_1 = 0;
                    var sExist_1 = false;
                    var checkSlot = this_1.bookedSlot.map(function (b) {
                        if (b.startDate.split('+')[0] == (dt + 'T' + fromTime_2 + ":00")) {
                            sExist_1 = true;
                            b.courseId == _this.courseId ? cCount_1++ : '';
                        }
                    });
                    if (sExist_1 && cCount_1 == 0) {
                        return "continue";
                    }
                    else if (cCount_1 > 0) {
                        titleClass = "fc-daygrid-event-dot-blue";
                    }
                }
                var st = new Date(d);
                var et = new Date(d);
                st.setHours(fromHour);
                st.setMinutes(fromMinute);
                et.setHours(toHour);
                et.setMinutes(toMinute);
                var eventobj = {
                    title: fromTime_2 + "-" + toTime,
                    start: st,
                    end: et,
                    allday: false,
                    id: id,
                    editable: false,
                    custom: {
                        date: dt,
                        fromTime: fromTime_2,
                        toTime: toTime,
                        type: 'weekEvent',
                        selectedWeekIndex: weekDayIndex,
                        titleClass: titleClass
                    }
                };
                if (!this_1.eventOnDate[dt]) {
                    this_1.eventOnDate[dt] = {};
                    this_1.eventOnDate[dt][eventobj.title] = {
                        from_time: fromTime_2,
                        to_time: toTime
                    };
                }
                else {
                    this_1.eventOnDate[dt][eventobj.title] = {
                        from_time: fromTime_2,
                        to_time: toTime
                    };
                }
                //this.calendarApi.addEvent(eventobj);
                if (!this_1.calendarApi.getEventById(id)) {
                    this_1.calendarApi.addEvent(eventobj);
                }
            };
            var this_1 = this;
            for (var d = x; d <= z; d.setDate(d.getDate() + 7)) {
                _loop_1(d);
            }
        }
        this.addedEvents.push(dataObj);
    };
    CalenderComponent.prototype.showInformation = function () {
        var dialogRef = this.dialog.open(tutor_info_dialog_component_1.TutorInfoDialogComponent, {
            maxWidth: '35vw',
            data: { type: 'CAL' }
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderComponent.prototype, "isWeekVisible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderComponent.prototype, "isViewOnly", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderComponent.prototype, "tutorEvents", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderComponent.prototype, "tutorId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderComponent.prototype, "registerdEvents", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CalenderComponent.prototype, "isDateEventEditable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderComponent.prototype, "bookedSlot", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CalenderComponent.prototype, "courseId", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CalenderComponent.prototype, "getEventsOnSidebar", void 0);
    __decorate([
        core_1.ViewChild('fullcalendar'),
        __metadata("design:type", angular_1.FullCalendarComponent)
    ], CalenderComponent.prototype, "calendarComponent", void 0);
    CalenderComponent = __decorate([
        core_1.Component({
            selector: 'app-calender',
            templateUrl: './calender.component.html',
            styleUrls: ['./calender.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, core_1.ChangeDetectorRef])
    ], CalenderComponent);
    return CalenderComponent;
}());
exports.CalenderComponent = CalenderComponent;
//# sourceMappingURL=calender.component.js.map