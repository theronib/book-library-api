import { getBooks as getBooksService } from "../services/bookService";
import { getBookById as getBookByIdService } from "../services/bookService";
import { createBook as createBookService } from "../services/bookService";
import { replaceBook as replaceBookService } from "../services/bookService";
import { deleteBook as deleteBookService } from "../services/bookService";
import { Request, Response } from "express";

// ОТРИМАТИ СПИСОК ВСІХ КНИГ
export function getBooks(req: Request, res: Response) {
    const books = getBooksService();

    res.json({
        books: books
    });
}

// ОТРИМАТИ КНИГУ ЗА ID
export function getBookById(req: Request, res: Response) {
    const id = String(req.params.id);
    const book = getBookByIdService(id);

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
export function createBook(req: Request, res: Response) {
    const { title, author, year, isbn, available } = req.body;
    console.log(title, author);

    if (!title || !author) {
        return res.status(400).json({
            error: "Title and author are required"
        });
    }

    const bookData = {
        title: title,
        author: author,
        year: year,
        isbn: isbn,
        available: available
    };

    const newBook = createBookService(bookData);

    res.status(201).json({
        book: newBook
    });
}

// ОНОВИТИ КНИГУ
export function replaceBook(req: Request, res: Response) {
    const id = String(req.params.id);
    const { title, author, year, isbn, available } = req.body;

    const bookData = {
        title: title,
        author: author,
        year: year,
        isbn: isbn,
        available: available
    }

    const replaceBook = replaceBookService(id, bookData);

    res.status(200).json({
        book: replaceBook
    })
}

// ВИДАЛИТИ КНИГУ 
export function deleteBook(req: Request, res: Response){
    const id = String(req.params.id);

    const deletedBook = deleteBookService(id);

    res.status(204).json({
        book: deletedBook
    });
}