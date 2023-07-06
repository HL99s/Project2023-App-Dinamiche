DROP TABLE IF EXISTS credentials;

CREATE TABLE credentials
(
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    customer_id INT                 NOT NULL,

    FOREIGN KEY (customer_id)
        REFERENCES customer (customer_id)
);


INSERT INTO credentials(username, password, customer_id)
VALUES ('Prova', '$2b$10$WffTkGHgAjtye9rGXRzZ1enMJLE/b9qEXHDhus1BG84gBfOWv4Y3q', 1);