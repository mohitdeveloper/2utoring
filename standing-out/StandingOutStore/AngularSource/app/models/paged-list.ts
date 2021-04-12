export class PagedList<T>{
    paged: Paged;
    data: T[];
}

export class Paged {
    page: number;
    take: number;
    totalPages: number;
    totalCount: number;
    showing: string;
}