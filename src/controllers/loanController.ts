import { getLoans as getLoansService } from "../services/loanService";
import { returnLoan as returnLoanService } from "../services/loanService";
import { giveLoanToUser as giveLoanToUserService } from "../services/loanService";
import { checkIsLoanActive as checkIsLoanActiveService } from "../services/loanService";
import { checkIsBookAvailable, getBookById as getBookByIdService, setBookAvailability } from "../services/bookService";
import { Request, Response } from "express";


// ПЕРЕГЛЯНУТИ ВСІ ПОЗИКИ
export function getLoans(req: Request, res: Response) {
    const loans = getLoansService();

    res.json({
        loans: loans
    });
}

// ВИДАТИ КНИГУ
export function giveLoanToUser(req: Request, res: Response) {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({
            error: "User ID and Book ID are required"
        });
    }

    // ПЕРЕВІРКА НА ТЕ ЧИ БУЛА КНИГА ВЖЕ ВИДАНА 
    const isActiveLoanExists = checkIsLoanActiveService(bookId);
    
    // ПЕРЕВІРКА НА ТЕ ЧИ ІСНУЄ КНИГА І ЧИ ВОНА ДОСТУПНА
    const isBookAvailable = checkIsBookAvailable(bookId);

    console.log("isBookAvailable:", isBookAvailable);
    console.log("isActiveLoanExists:", isActiveLoanExists);

    if (!isBookAvailable || isActiveLoanExists) {
        return res.status(400).json({
            error: "Book is not available for loan"
        })
    }
    // УСПІШНА ВИДАЧА КНИГИ
    else {
        const loanData = {
            userId: userId,
            bookId: bookId
        };

        // СТВОРЕННЯ ПОЗИКИ 
        const newLoan = giveLoanToUserService(loanData);

        // ВСТАНОВЛЕННЯ СТАТУСУ ДОСТУПНОСТІ КНИГИ
        setBookAvailability(bookId, false);

        res.status(201).json({
            loan: newLoan
        });
    }
}

// ПОВЕРНУТИ КНИГУ
export function returnLoan(req: Request, res: Response) {
    const loanId = String(req.params.id);

    if (!loanId) {
        return res.status(400).json({
            error: "Loan ID is required"
        });
    }

    const updatedLoan = returnLoanService(loanId);

    if (!updatedLoan) {
        return res.status(404).json({
            error: "Loan not found"
        });
    }

    res.json({
        loan: updatedLoan
    });
}