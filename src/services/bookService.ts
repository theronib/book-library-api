import { randomUUID } from "crypto";
import { CreateBookDto, ReplaceBookDto } from "../schemas/book.schema";
import { BOOKS } from "../storage/books";
import { Book } from "../types/book";

// ОТРИМАТИ СПИСОК КНИГ
export function getBooks() {
    return BOOKS;
}

// ОТРИМАТИ КНИГУ ЗА ID
export function getBookById(id: string) {
    return BOOKS.find(book => book.id === id);
}

// СТВОРИТИ КНИГУ
export function createBook(book: CreateBookDto) {
    const newBook: Book = {
        id: randomUUID(),
        title: book.title,
        author: book.author,
        year: book.year,
        isbn: book.isbn,
        available: book.available
    }

    BOOKS.push(newBook);
    return newBook;
}

// ОНОВИТИ КНИГУ
export function replaceBook(id: string, book: ReplaceBookDto) {
    const existingBook = getBookById(id);
    if (!existingBook) {
        return null;
    }

    existingBook.title = book.title ?? existingBook.title;
    existingBook.author = book.author ?? existingBook.author;
    existingBook.year = book.year ?? existingBook.year;
    existingBook.isbn = book.isbn ?? existingBook.isbn;
    existingBook.available = book.available ?? existingBook.available;

    return existingBook;
}

// ВИДАЛИТИ КНИГУ
export function deleteBook(id: string) {
    const existingBook = getBookById(id);
    const existingBookID = BOOKS.findIndex(b => b.id === id);
    if (!existingBook) {
        return null;
    }

    BOOKS.splice(existingBookID, 1);
    return existingBook;
}

// ПЕРЕВІРКА НА ТЕ ЧИ ДОСТУПНА КНИГА
export function checkIsBookAvailable(id: string) {
    const existingBook = getBookById(id);
    if (!existingBook) {
        return false;
    }

    return existingBook.available;
}

// ЗМІНА СТАТУСУ ДОСТУПНОСТІ КНИГИ
export function setBookAvailability(id: string, availability: boolean) {
    const existingBook = getBookById(id);
    if (!existingBook) {
        return null;
    }

    existingBook.available = availability;
    return existingBook;
}