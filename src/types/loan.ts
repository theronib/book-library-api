export enum LoanStatus {
    ACTIVE = 'active',
    RETURNED = 'returned',
}

export type Loan = {
    id: string;
    userId: string;
    bookId: string;
    loanDate: Date;
    returnDate: Date | null;
    status: LoanStatus;
}