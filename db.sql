CREATE TABLE "books" (
    "id" SERIAL,
    "book_id" text,
    "title" text,
    "author" text,
    "genre" text,
    "description" text,
    "pub_date" text,
    "isbn" text,
    "cover" text,
    "userid" text references users(userid),
    PRIMARY KEY ("id")
);


CREATE TABLE "users" (
    "userid" text,
    "token" text,
    "name" text,
    "email" text,
    PRIMARY KEY ("userid")
);
