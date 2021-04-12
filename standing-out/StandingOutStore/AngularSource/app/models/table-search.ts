export class TableSearch {
    take: number;
    search: string;
    page: number = 1;
    totalPages: number = 1;
    sortType: string;
    order: string;
    startDate?: Date;
    endDate?: Date;
    filter: string;
}