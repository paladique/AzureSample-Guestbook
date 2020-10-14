CREATE TABLE guestbook
(
    id serial PRIMARY KEY,
    entrydate datetime default now(),
    sender VARCHAR(100),
    message VARCHAR(200)
);