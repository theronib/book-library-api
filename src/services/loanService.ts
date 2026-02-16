import { randomUUID } from "crypto";
import { CreateLoanDto } from "../schemas/loan.schema";
import { LOANS } from "../storage/loans";
import { Loan, LoanStatus } from "../types/loan";
import { setBookAvailability } from "./bookService";

// ПЕРЕГЛЯНУТИ ВСІ ПОЗИКИ
export function getLoans() {
    return LOANS;
}

// ОТРИМАТИ КНИГУ ЗА ID
export function getLoanById(id: string) {
    return LOANS.find(loan => loan.id === id);
}

// ВИДАТИ КНИГУ
export function giveLoanToUser(createLoanDto: CreateLoanDto) {
    const newLoan: Loan = {
        id: randomUUID(),
        userId: createLoanDto.userId,
        bookId: createLoanDto.bookId,
        loanDate: new Date(),
        returnDate: null,
        status: LoanStatus.ACTIVE,
    }

    LOANS.push(newLoan);
    return newLoan;
}

// ПОВЕРНУТИ КНИГУ
export function returnLoan(loanId: string) {
    const existingLoan = getLoanById(loanId);
    if (!existingLoan) {
        return null;
    }

    // ЗАПОВНЕННЯ RETURNDATE
    existingLoan.returnDate = new Date();

    // ЗМІНА СТАТУСУ ПОЗИКИ
    existingLoan.status = LoanStatus.RETURNED;
    
    // ВСТАНОВЛЕННЯ СТАТУСУ ДОСТУПНОСТІ КНИГИ
    setBookAvailability(existingLoan.bookId, true);

    return existingLoan;
}

// ПЕРЕВІРКА НА ТЕ ЧИ ІСНУЄ У КНИГИ ПОЗИКА
export function checkIsLoanActive(bookId: string) {
    const isActiveLoanExists = LOANS.some(l => l.bookId === bookId && l.status === LoanStatus.ACTIVE);
    
    return isActiveLoanExists;
}