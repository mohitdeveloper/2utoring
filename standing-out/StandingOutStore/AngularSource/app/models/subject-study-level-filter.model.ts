import { SubjectStudyLevelSetupType } from '../models/index';
import { TableSearch } from "./table-search";

export class SubjectStudyLevelSearchModel extends TableSearch {
    owningEntityId: string;
    subjectStudyLevelSetupType: SubjectStudyLevelSetupType;
    subjectNameSearch: string;
    studyLevelSearch: string;
}