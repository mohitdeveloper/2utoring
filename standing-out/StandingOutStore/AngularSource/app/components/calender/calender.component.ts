import { Component, OnInit, AfterViewInit, ViewChild, Inject, EventEmitter, Output, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput, Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentExampleDialog } from './dialog-content-example';
import { TutorInfoDialogComponent } from '../tutor/tutors-index/tutor-info-dialog.component';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit, AfterViewInit {
  public events;
  public selectedWeekIndex;
    @Input() isWeekVisible: boolean = true;
    @Input() isViewOnly: boolean = false;
  @Input() tutorEvents: any;
  @Input() tutorId: any;
  @Input() registerdEvents:any;
  @Input() isDateEventEditable: boolean = true;
  @Input() bookedSlot:any;
  @Input() courseId: any;
  @Output() getEventsOnSidebar = new EventEmitter<any>();
    
    public addedEvents = [];
    public deletedEvents = [];
  public eventOnDate = {};
  clickedEvent: any = [];



  public weekdays = [
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
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    dateClick: this.onDateClick.bind(this), // bind is important!,
    eventClick: this.onEventClick.bind(this),
    eventContent: function (arg) {
      let titleClass = arg.event.extendedProps.custom.titleClass?arg.event.extendedProps.custom.titleClass:"fc-daygrid-event-dot-green";
      let titleHtml = `
      <div class="${titleClass}"></div>
      <div class="fc-event-title">${arg.event.title}
      </div>
      `
			return { html: titleHtml }
		}
  };

  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;

  calendarEvents: EventInput[] = [];

  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

  calendarApi: Calendar;
  initialized = false;
    newChange: boolean;
  constructor(public dialog: MatDialog,private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
  }



  ngAfterViewChecked() {
    this.calendarApi = this.calendarComponent.getApi();

    if (this.calendarApi && !this.initialized) {

      this.initialized = true;
      this.loadTutorAllEvents();

    }
  }


  /*ngDoCheck(){
    ////debugger;
    //this.changeDetectorRef.detectChanges();
    //this.calendarApi = this.calendarComponent.getApi();
    
  }*/
  
  ngOnChanges(changes: SimpleChanges) {
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

    if(this.registerdEvents){
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
        
        this.registerdEvents.map(r => {
        this.setAvailabilityEvents(r);
      });
    }
  }

  ngAfterViewInit() {}
  loadEvents() {}
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
    //debugger;
    if (!this.isDateEventEditable) {
      return;
    }
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    clickedDate.date.setHours(0, 0, 0, 0);

    if (d > clickedDate.date) {
      alert('You can not add/edit event on previous dates');
      return;
    }
    let obj = { date: clickedDate.dateStr, type: '', fromTime: '', toTime: '', selectedWeekIndex: '' }
    this.setEventOnWeek("", -1, "", "", obj);
  }

  onEventClick(clickedEvent: any) {
      if (this.isViewOnly) {
          return;
      }

    if (!this.isDateEventEditable) {
      let d1 = new Date();
      let d2 = new Date(clickedEvent.event.extendedProps.custom.date);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);

    if (d1 > d2) {
      alert('You can not add/edit event on previous dates');
      return;
    }
      this.getEventsOnSidebar.emit(clickedEvent);
      return;
    }

    
    let ev = clickedEvent.event.extendedProps.custom;
    this.setEventOnWeek("", -1, ev.fromTime, ev.toTime, ev);
  }

  onEventRender(info: any) {
    let title = info.el.find('.fc-title');
    title.html(title.text());
  }

  setEventOnWeek(i, slotIndex = -1, fromTime = "", toTime = "", selectedDate = { date: '', type: '', fromTime: '', toTime: '', selectedWeekIndex: '' }) {
    if (!this.isDateEventEditable) {
      return;
    }

    this.selectedWeekIndex = i;
    let evts = this.weekdays[this.selectedWeekIndex]?this.weekdays[this.selectedWeekIndex].events:(this.eventOnDate[selectedDate.date] || {})
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '350px',
        data: { selectedWeekIndex:i, events: evts, slotIndex: slotIndex, selectedDate: selectedDate, selectedWeekDay: this.weekdays[i] ? this.weekdays[i].dayName : "", dialogText: "text", fromTime: fromTime, toTime: toTime }
    });

      const subscribeDialog = dialogRef.componentInstance.onSubmit.subscribe((data) => {
      
      if (this.selectedWeekIndex === "") {
        let idx = this.addedEvents.findIndex(function (item) {
            let dt = item.startTime.split("T")[0]
            return (dt == selectedDate.date) && item.title == (data.oldFromTime + "-" + data.oldToTime) && item.dayOfWeek == -1

        });

          
        let d = new Date(selectedDate.date);
        let id = selectedDate.date + "-" + data.fromTime + "-" + data.toTime;
        let oldId = selectedDate.date + "-" + data.oldFromTime + "-" + data.oldToTime;
        let oldEvent = this.calendarApi.getEventById(oldId);
        if (oldEvent) {
          oldEvent.remove();
        }
        if(this.eventOnDate[selectedDate.date]){
          delete this.eventOnDate[selectedDate.date][data.oldFromTime + "-" + data.oldToTime];
          }
          let startTime = new Date(selectedDate.date);
          let endTime = new Date(selectedDate.date);
          startTime.setHours(data.fromHour, data.fromMinute, 0, 0)
          endTime.setHours(data.toHour, data.toMinute, 0, 0);

          if (data.isDelete) {
              //debugger;
              if (oldEvent.extendedProps.custom.type == 'weekEvent') {
                  this.deletedEvents.push({
                      "title": data.fromTime + "-" + data.toTime,
                      "tutorId": this.tutorId,
                      "dayOfWeek": -1,
                      "specificDate": d.toISOString(),
                      "startTime": this.getEventTime(startTime),
                      "endTime": this.getEventTime(endTime),
                      "slotType": 2,
                      "slotDescription": "Test Put Method"
                  });
              }
             
              if (idx != -1) {
                  this.addedEvents.splice(idx, 1);
              }
          
          return false;
          }

          let didx = this.deletedEvents.findIndex(function (item) {
             
              return item.startTime == selectedDate.date + "T" + data.fromTime + ":00";

          });

          if (didx != -1) {
              this.deletedEvents.splice(didx, 1);
          }
       

        let event = {
          title: data.fromTime + "-" + data.toTime,
          start: d.setHours(data.fromHour, data.fromMinute, 0, 0),
          end: d.setHours(data.toHour, data.toMinute, 0, 0),
          allday: false,
          editable: false,
          custom: {
            date: d.toISOString().slice(0, 10),
            fromTime: data.fromTime,
            toTime: data.toTime,
            type: 'dateEvent',
           
          },
          id: id
        };

        if(!this.eventOnDate[selectedDate.date]){
          this.eventOnDate[selectedDate.date]= {};
          this.eventOnDate[selectedDate.date][event.title] = {
            from_time: data.fromTime,
            to_time: data.toTime
          };;
        }else{
          this.eventOnDate[selectedDate.date][event.title] = {
            from_time: data.fromTime,
            to_time: data.toTime
          };;
        }

        if (idx > -1) {
          this.addedEvents[idx] = {
            "title": data.fromTime + "-" + data.toTime,
            "tutorId": this.tutorId,
            "dayOfWeek": -1,
            "specificDate": d.toISOString(),
            "startTime": this.getEventTime(startTime),
            "endTime": this.getEventTime(endTime),
            "slotType": 1,
            "slotDescription": "Test Put Method"
          }
        } else {
          this.addedEvents.push({
            "title": data.fromTime + "-" + data.toTime,
            "tutorId": this.tutorId,
            "dayOfWeek": -1,
            "specificDate": d.toISOString(),
            "startTime": this.getEventTime(startTime),
            "endTime": this.getEventTime(endTime),
            "slotType": 1,
            "slotDescription": "Test Put Method"
          });
        }
        console.log("Event",event);
        this.calendarApi.addEvent(event);
        this.calendarApi.render();
        dialogRef.componentInstance.isSubmit = false;
        return;
      }

      let idx = this.addedEvents.findIndex((item)=>{
        return item.dayOfWeek == this.selectedWeekIndex && item.title == (data.oldFromTime + "-" + data.oldToTime)
      });
      let startTime = new Date();
      let endTime = new Date();
      startTime.setHours(data.fromHour, data.fromMinute, 0, 0)
        endTime.setHours(data.toHour, data.toMinute, 0, 0);
        ////debugger;
      if (!data.isDelete) {
        if (idx > -1) {
          this.addedEvents[idx] = {
            "title": data.fromTime + "-" + data.toTime,
            "tutorId": this.tutorId,
            "dayOfWeek": this.selectedWeekIndex,
            "startTime": this.getEventTime(startTime),
            "endTime": this.getEventTime(endTime),
            "slotType": 0,
            "slotDescription": "Test Put Method"
          }
        } else {
          this.addedEvents.push({
            "title": data.fromTime + "-" + data.toTime,
            "tutorId": this.tutorId,
            "dayOfWeek": this.selectedWeekIndex,
            "startTime": this.getEventTime(startTime),
            "endTime": this.getEventTime(endTime),
            "slotType": 0,
            "slotDescription": "Test Put Method"
          });

          
        }

        if (data.slotIndex >= 0) {
          this.weekdays[this.selectedWeekIndex].events[slotIndex] = {
            from_time: data.fromTime,
            to_time: data.toTime,
            sortKey: data.fromHour + data.fromMinute*0.1
          };
        } else {
          this.weekdays[this.selectedWeekIndex].events.push({
            from_time: data.fromTime,
            to_time: data.toTime,
            sortKey: data.fromHour + data.fromMinute*0.1
          });
        }

        this.weekdays[this.selectedWeekIndex].events.sort((a, b) => {
            return a.sortKey - b.sortKey;
        });
        
      } else {
        this.addedEvents.splice(idx, 1);
        this.weekdays[this.selectedWeekIndex].events.splice(data.slotIndex, 1);

      }
      




      let promises = [];
      let x = new Date();
      let z = new Date();
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

      let dayC;
      if(x.getDay() > this.selectedWeekIndex){
        dayC = 7 - x.getDay()+this.selectedWeekIndex;
      }else{
        dayC = this.selectedWeekIndex-x.getDay();

      }
      x.setDate(x.getDate() + dayC);
      for (var d = x; d <= z; d.setDate(d.getDate() + 7)) {
        console.log("Dates", d);
        promises.push(this.setWeekEvent(d, data, this.selectedWeekIndex));
      }

      Promise.all(promises).then(resp => {
        dialogRef.componentInstance.isSubmit = false;
        this.calendarApi.render();
      })

    });


  }

  setWeekEvent(d, data, selectedWeekIndex) {
    let date = d.toISOString().slice(0, 10);
    let id = date + "-" + data.fromTime + "-" + data.toTime;
    let oldId = date + "-" + data.oldFromTime + "-" + data.oldToTime;
    let oldEvent = this.calendarApi.getEventById(oldId);
    let currEvent = this.calendarApi.getEventById(id)
    if (oldEvent) {
      oldEvent.remove();
    }

    if(this.eventOnDate[date]){
      delete this.eventOnDate[date][data.oldFromTime + "-" + data.oldToTime];          

    }


    if(data.isDelete){
      return;
    }
      if (currEvent) {
        currEvent.remove();
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
        selectedWeekIndex: selectedWeekIndex,
       
      }
    };
    if(!this.eventOnDate[date]){
      this.eventOnDate[date]= {};
      this.eventOnDate[date][event.title] = {
        from_time: data.fromTime,
        to_time: data.toTime
      };
    }else{
      this.eventOnDate[date][event.title] = {
        from_time: data.fromTime,
        to_time: data.toTime
      };
      }

      
          this.calendarApi.addEvent(event);

  }

  editWeekTimeSlot(event, i, slotIndex, from_time, to_time) {
    event.stopPropagation();
    if (!this.isDateEventEditable) {
      return;
    }
    this.setEventOnWeek(i, slotIndex, from_time, to_time)
  }

  updateEvent() {
    /*let ff = {
      groupId: 'blueEvents', // recurrent events in this group move together
        //daysOfWeek: ['5'],
        daysOfWeek: [5, 6],
          startRecur: new Date("2020-09-10"),
            endRecur: new Date("2020-09-20"),
              allday: true
    }
    this.calendarApi.removeAllEvents(ff);*/
  }

  getEventTime(d) {
    const pad = n => n < 10 ? '0' + n : n;
    return d.getFullYear() + '-'
      + pad(d.getMonth() + 1) + '-'
      + pad(d.getDate()) + 'T'
      + pad(d.getHours()) + ':'
      + pad(d.getMinutes()) + ':'
      + pad(d.getSeconds()) + 'Z'
  }

  setAvailabilityEvents(event)
  {   
      let slotType = {
          'Pattern': 0,
          'Added': 1,
          'Deleted': 2
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
      let weekDayIndex = daysObj[event.dayOfWeek] >= 0 ? daysObj[event.dayOfWeek]:-1;
      let dataObj;
    if(weekDayIndex == -1){
      
      let startTime = new Date(event.startTime);
      let endTime = new Date(event.endTime);
      let fromTime = pad(startTime.getHours())+":"+pad(startTime.getMinutes());
      let toTime = pad(endTime.getHours())+":"+pad(endTime.getMinutes());
      let id = event.startTime.split("T")[0]+'-'+fromTime + "-" + toTime;

       
      dataObj = {
        "title": fromTime + "-" + toTime,
        "tutorId": this.tutorId,
        "dayOfWeek": -1,
        "specificDate": event.startTime,
        "startTime": event.startTime,
        "endTime": event.endTime,
          "slotType": slotType[event.slotType],
        "slotDescription": "Test Put Method"
        }

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

      let dt = event.startTime.split("T")[0];
      if(this.bookedSlot){
       let checkSlot =  this.bookedSlot.some(b=>{
        if(b.startDate.split('+')[0]==(dt+'T'+fromTime+":00")){
          return true;
        }
        })

        if(checkSlot){
          return;
        }
      }
      let eventObj = {
        title: fromTime + "-" + toTime,
        start: startTime,
        end: endTime,
        allday: false,
        editable: false,
        custom: {
          date: dt,
          fromTime: fromTime,
          toTime: toTime,
          type: 'dateEvent',
         
        },
        id: id
      };
      if(!this.eventOnDate[dt]){
        this.eventOnDate[dt]= {};
        this.eventOnDate[dt][eventObj.title] = {
          from_time: fromTime,
          to_time: toTime
        };;
      }else{
        this.eventOnDate[dt][eventObj.title] = {
          from_time: fromTime,
          to_time: toTime
        };;
      }

        if (!this.calendarApi.getEventById(id)) {
            this.calendarApi.addEvent(eventObj);
        }
      
    }else{
      
     
      let stdate = event.createdDate.split("T")[0];
      let x = new Date(stdate);
      let dayC;
      if(x.getDay() > weekDayIndex){
        dayC = 7 - x.getDay()+weekDayIndex;
      }else{
        dayC = weekDayIndex-x.getDay();

      }
      x.setDate(x.getDate() + dayC);
      var z = new Date(x.getFullYear(), x.getMonth() + 1, 0);
      let startTime = new Date(event.startTime);
      let endTime = new Date(event.endTime);
      let fromHour = startTime.getHours();
      let fromMinute = startTime.getMinutes();
      let toHour = endTime.getHours();
      let toMinute = endTime.getMinutes();

      let fromTime = pad(fromHour)+":"+pad(fromMinute);
      let toTime = pad(toHour)+":"+pad(toMinute);

      dataObj = {
        "title": fromTime + "-" + toTime,
        "tutorId": this.tutorId,
        "dayOfWeek": weekDayIndex,
        "startTime": event.startTime,
          "endTime": event.endTime,
          "slotType": slotType[event.slotType],
        "slotDescription": "Test Put Method"
      }

      this.weekdays[weekDayIndex].events.push({
        from_time: fromTime,
        to_time: toTime
      })
      for (let d = x; d <= z; d.setDate(d.getDate() + 7)) {
        let dt = d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
          let id = dt + '-' + fromTime + "-" + toTime;

          
        //console.log("Id",id);
        let titleClass = "fc-daygrid-event-dot-green";
        if(this.bookedSlot){
          //if(dt=="2020-09-27"){
           // debugger;
         // }
         
        let cCount = 0;
        let sExist = false;
         let checkSlot =  this.bookedSlot.map(b=>{
            if(b.startDate.split('+')[0]==(dt+'T'+fromTime+":00")){
              sExist = true;
              b.courseId==this.courseId?cCount++:'';
            }
          })
  
          if(sExist && cCount==0){
            continue;
          }else if(cCount>0){
            titleClass = "fc-daygrid-event-dot-blue"
          }
        }
        let st = new Date(d);
        let et = new Date(d);
        st.setHours(fromHour);
        st.setMinutes(fromMinute);
        et.setHours(toHour);
        et.setMinutes(toMinute);
         
        
        let eventobj = {
          title: fromTime+"-"+toTime,
          start: st,
          end: et,
          allday: false,
          id: id,
          editable: false,
          custom: {
            date: dt,
            fromTime: fromTime,
            toTime: toTime,
            type: 'weekEvent',
            selectedWeekIndex: weekDayIndex,
            titleClass: titleClass
           
          }
        };
        if(!this.eventOnDate[dt]){
          this.eventOnDate[dt]= {};
          this.eventOnDate[dt][eventobj.title] = {
            from_time: fromTime,
            to_time: toTime
          };
        }else{
          this.eventOnDate[dt][eventobj.title] = {
            from_time: fromTime,
            to_time: toTime
          };
        }
        //this.calendarApi.addEvent(eventobj);
          if (!this.calendarApi.getEventById(id)) {
              this.calendarApi.addEvent(eventobj);
          }
    }
    }

    this.addedEvents.push(dataObj);

   
     
  }

    showInformation() {
        const dialogRef = this.dialog.open(TutorInfoDialogComponent, {
            maxWidth: '35vw',
            data: { type: 'CAL' }
        });
    }



}

