export class StripePagedList<T>{
    paged: StripePaged;
    data: T[];
}

export class StripePaged {
    page: number;
    take: number;
    hasMore: boolean;
}