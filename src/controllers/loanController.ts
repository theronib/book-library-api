import { getLoans as getLoansService } from "../services/loanService";
import { getAllLoans as getAllLoansService } from "../services/loanService";
import { returnLoan as returnLoanService } from "../services/loanService";
import { giveLoanToUser as giveLoanToUserService } from "../services/loanService";
import { checkIsLoanActive as checkIsLoanActiveService } from "../services/loanService";
import { checkIsBookAvailable, getBookById as getBookByIdService, setBookAvailability } from "../services/bookService";
import { Request, Response } from "express";
import { RequestWithUser } from "../middleware/auth.middleware";
import { RoleStatus } from "../generated/prisma/enums";

// ПЕРЕГЛЯНУТИ ВСІ ПОЗИКИ
export async function getLoans(req: Request, res: Response) {
    const user = (req as RequestWithUser).user;
    const userId = user.id;
    const userRole = user.role;
    let loans = []

    if (userRole === RoleStatus.USER) {
        loans = await getLoansService(userId);
    }
    else {
        loans = await getAllLoansService();
    }

    res.json({
        loans: loans
    });
}

// ВИДАТИ КНИГУ
export async function giveLoanToUser(req: Request, res: Response) {
    const user = (req as RequestWithUser).user;
    const userId = user.id;
    const { bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({
            error: "Book ID is required"
        });
    }

    // ПЕРЕВІРКА НА ТЕ ЧИ БУЛА КНИГА ВЖЕ ВИДАНА 
    const isActiveLoanExists = await checkIsLoanActiveService(bookId);

    // ПЕРЕВІРКА НА ТЕ ЧИ ІСНУЄ КНИГА І ЧИ ВОНА ДОСТУПНА
    const isBookAvailable = await checkIsBookAvailable(bookId);

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
            bookId: bookId
        };

        // СТВОРЕННЯ ПОЗИКИ 
        const newLoan = await giveLoanToUserService(userId, loanData);

        // ВСТАНОВЛЕННЯ СТАТУСУ ДОСТУПНОСТІ КНИГИ
        await setBookAvailability(bookId, false);

        res.status(201).json({
            loan: newLoan
        });
    }
}

// ПОВЕРНУТИ КНИГУ
export async function returnLoan(req: Request, res: Response) {
    try {
        const user = (req as RequestWithUser).user;
        const userId = user.id;
        const loanId = String(req.params.id);

        if (!loanId) {
            return res.status(400).json({
                error: "Loan ID is required"
            });
        }

        const updatedLoan = await returnLoanService(userId, loanId);

        if (!updatedLoan) {
            return res.status(404).json({
                error: "Loan not found"
            });
        }

        res.json({
            loan: updatedLoan
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "You don't have a loan for this book") {
            return res.status(403).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: "Internal server error"
        });

    }
}