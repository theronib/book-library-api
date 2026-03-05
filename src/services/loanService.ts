import { randomUUID } from "crypto";
import { CreateLoanDto } from "../schemas/loan.schema";
import { setBookAvailability } from "./bookService";
import prisma from "../lib/prisma";
import { LoanStatus } from "../generated/prisma/enums";
import { RequestWithUser } from "../middleware/auth.middleware";


// ПЕРЕГЛЯНУТИ ВСІ ПОЗИКИ (ПОЗИКИ ТІЛЬКИ КОРИСТУВАЧА)
export async function getLoans(id: string) {
    const loans = await prisma.loan.findMany({
        where: {
            userId: id
        }
    });
    return loans;
}

// ПЕРЕГЛЯНУТИ ПОЗИКИ ВСІХ КОРИСТУВАЧІВ (АДМІН)
export async function getAllLoans() {
    const loans = await prisma.loan.findMany();
    return loans;
}

// ОТРИМАТИ ПОЗИКУ ЗА ID
export async function getLoanById(id: string) {
    const loan = await prisma.loan.findUnique({
        where: {
            id: id
        }
    })

    return loan;
}

// ВИДАТИ КНИГУ
export async function giveLoanToUser(userId: string, createLoanDto: CreateLoanDto) {
    

    const newLoan = {
        userId: userId,
        bookId: createLoanDto.bookId,
        loanDate: new Date(),
        returnDate: null,
        status: LoanStatus.ACTIVE,
    }

    const loanDB = await prisma.loan.create({
        data: newLoan
    });

    return loanDB;
}

// ПОВЕРНУТИ КНИГУ
export async function returnLoan(userId: string, loanId: string) {
    const existingLoan = await getLoanById(loanId);
    if (!existingLoan) {
        return null;
    }

    if(existingLoan.userId !== userId){
        throw new Error("You don't have a loan for this book")
    }

    // ЗАПОВНЕННЯ RETURNDATE
    // ЗМІНА СТАТУСУ ПОЗИКИ
    const existingLoanDB = await prisma.loan.update({
        where: {
            id: loanId
        },
        data: {
            returnDate: new Date(),
            status: LoanStatus.RETURNED
        }
    })

    // ВСТАНОВЛЕННЯ СТАТУСУ ДОСТУПНОСТІ КНИГИ
    await setBookAvailability(existingLoanDB.bookId, true);

    return existingLoanDB;
}

// ПЕРЕВІРКА НА ТЕ ЧИ ІСНУЄ У КНИГИ ПОЗИКА
export async function checkIsLoanActive(bookId: string) {
    const loan = await prisma.loan.findFirst({
        where: {
            bookId: bookId,
            status: LoanStatus.ACTIVE
        }
    })

    const isActiveLoanExists = loan !== null;

    return isActiveLoanExists;
}