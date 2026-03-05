import { getBooks as getBooksService } from "../services/bookService";
import { getBookById as getBookByIdService } from "../services/bookService";
import { createBook as createBookService } from "../services/bookService";
import { replaceBook as replaceBookService } from "../services/bookService";
import { deleteBook as deleteBookService } from "../services/bookService";
import { Request, Response } from "express";

// ОТРИМАТИ СПИСОК ВСІХ КНИГ
export async function getBooks(req: Request, res: Response) {
    const books = await getBooksService();

    res.json({
        books: books
    });
}

// ОТРИМАТИ КНИГУ ЗА ID
export async function getBookById(req: Request, res: Response) {
    const id = String(req.params.id);
    const book = await getBookByIdService(id);

    if (book) {
        return res.json({
            data: book
        });
    }
    else {
        return res.status(404).json({
            error: "Book not found"
        })
    }
}

// СТВОРИТИ КНИГУ
export async function createBook(req: Request, res: Response) {
    try {
        const { title, author, year, isbn, available } = req.body;

        const bookData = {
            title: title,
            author: author,
            year: year,
            isbn: isbn,
            available: available
        };

        const newBook = await createBookService(bookData);

        res.status(201).json({
            book: newBook
        });
    }
    catch {
        return res.status(500).json({
            error: "Internal server error"
        })
    }

}

// ОНОВИТИ КНИГУ
export async function replaceBook(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const { title, author, year, isbn, available } = req.body;

        const bookData = {
            title: title,
            author: author,
            year: year,
            isbn: isbn,
            available: available
        }

        const replaceBook = await replaceBookService(id, bookData);

        res.status(200).json({
            book: replaceBook
        })
    }
    catch (error) {
        if (error instanceof Error && error.message === "Book not found") {
            return res.status(404).json({
                error: error.message
            })
        }
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

// ВИДАЛИТИ КНИГУ 
export async function deleteBook(req: Request, res: Response) {
    try {
        const id = String(req.params.id);

        await deleteBookService(id);

        res.status(204).end();
    }
    catch (error) {
        if (error instanceof Error && error.message === "Book not found") {
            return res.status(404).json({
                error: error.message
            })
        }
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}