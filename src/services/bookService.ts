import { CreateBookDto, ReplaceBookDto } from "../schemas/book.schema";
import prisma from "../lib/prisma";

// ОТРИМАТИ СПИСОК КНИГ
export async function getBooks() {
    const books = await prisma.book.findMany();
    return books;
}

// ОТРИМАТИ КНИГУ ЗА ID
export async function getBookById(id: string) {
    const book = await prisma.book.findUnique({
        where: {
            id: id
        }
    })

    return book;
}

// СТВОРИТИ КНИГУ
export async function createBook(book: CreateBookDto) {
    const newBook = {
        title: book.title,
        author: book.author,
        year: book.year,
        isbn: book.isbn,
        available: book.available
    }

    const bookDB = await prisma.book.create({
        data: newBook
    });
    console.log(bookDB)

    return bookDB;
}

// ОНОВИТИ КНИГУ
export async function replaceBook(id: string, book: ReplaceBookDto) {
    const existingBook = await getBookById(id);
    if (!existingBook) {
        throw new Error("Book not found")
    }

    const replacedBook = {
        title: book.title,
        author: book.author,
        year: book.year,
        isbn: book.isbn,
        available: book.available
    }

    const replacedBookDb = await prisma.book.update({
        where: {
            id: existingBook.id
        },
        data: replacedBook
    });

    return replacedBookDb;
}

// ВИДАЛИТИ КНИГУ
export async function deleteBook(id: string) {
    const existingBook = await getBookById(id);
    if (!existingBook) {
        throw new Error("Book not found")
    }

    await prisma.book.delete({
        where: {
            id: existingBook.id
        }
    });
}

// ПЕРЕВІРКА НА ТЕ ЧИ ДОСТУПНА КНИГА
export async function checkIsBookAvailable(id: string) {
    const book = await prisma.book.findFirst({
        where: {
            id: id,
            available: true
        }
    })

    const isBookAvailable = book !== null;

    return isBookAvailable;
}

// ЗМІНА СТАТУСУ ДОСТУПНОСТІ КНИГИ
export async function setBookAvailability(id: string, availability: boolean) {
    const existingBook = await getBookById(id);
    if (!existingBook) {
        throw new Error("Book not found");
    }

    const updatedBookAvaiability = await prisma.book.update({
        where: {
            id: existingBook.id
        },
        data: {
            available: availability
        }
    });

    return updatedBookAvaiability
}