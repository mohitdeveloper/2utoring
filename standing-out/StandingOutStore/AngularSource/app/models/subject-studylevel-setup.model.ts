import { SubjectStudyLevelSetupType, Subject, StudyLevel } from '../models/index';

export class SubjectStudyLevelSetup {
    subjectStudyLevelSetupId: string

    subjectId: string;
    studyLevelId: string;

    // UI elements as per Wizcraft
    position: number;
    subjects: Subject[];
    studyLevels: StudyLevel[];
    action: string;

    subjectName: string;
    studyLevelName: string;

    pricePerPerson: number;

    subjectStudyLevelSetupType: SubjectStudyLevelSetupType;
    groupPricePerPerson: number;
}
