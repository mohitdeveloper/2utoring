export class LessonTimetableLesson {
    startDate: Date;
    endDate: Date;
    duration: number;
    started: boolean;
    ended: boolean;
    complete: boolean;
    canStart: boolean;
    name: string;
    classSessionId: string;
    type: string;
    attendeeCount: number;
    requiresGoogleAccount: boolean;
    courseId: string;
    cancel: boolean;
}