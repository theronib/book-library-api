import { Loan, LoanStatus } from "../types/loan";

export const LOANS: Loan[] = [
    {
        id: "1",
        userId: "1",
        bookId: "2",
        loanDate: new Date("2026-02-15T10:00:00Z"),
        returnDate: null,
        status: LoanStatus.ACTIVE,
    },
    {
        id: "2",
        userId: "3",
        bookId: "5",
        loanDate: new Date("2026-01-20T12:00:00Z"),
        returnDate: new Date("2026-02-05T14:00:00Z"),
        status: LoanStatus.RETURNED,
    },
    {
        id: "3",
        userId: "2",
        bookId: "1",
        loanDate: new Date("2026-02-10T09:15:00Z"),
        returnDate: null,
        status: LoanStatus.ACTIVE,
    },
]