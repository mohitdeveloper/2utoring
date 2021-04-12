import { SessionAttendee } from "./session-attendee";

export class TutorCommandGroup {
    allSessionAttendees: SessionAttendee[] = [];
    groups: SessionGroupDraggable[] = [];
}

export class SessionGroupDraggable {
    accordianCollapsed = true;

    sessionGroupId: string;
    classSessionId: string;

    name: string;
    chatActive: boolean;
    hide: boolean;

    sessionAttendees: SessionAttendee[] = [];
}