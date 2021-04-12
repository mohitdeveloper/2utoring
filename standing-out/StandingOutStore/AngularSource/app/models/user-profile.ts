import { Role } from './role';

export class UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileUrl: string;
    active: boolean;
    isParent: boolean;
    parentFirstName: string;
    parentLastName: string;
    roles: Role[];
}