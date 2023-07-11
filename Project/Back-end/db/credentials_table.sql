create database appcredentials;

DROP TABLE IF EXISTS credentials;

CREATE TABLE credentials
(
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    customer_id INT                 NOT NULL
);

INSERT INTO credentials(username, password, customer_id)
VALUES ('username', '$2b$10$WffTkGHgAjtye9rGXRzZ1enMJLE/b9qEXHDhus1BG84gBfOWv4Y3q', 4);

INSERT INTO credentials(username, password, customer_id)
VALUES ('M.Smith', '$2b$10$T9p2V/f/kXGwgZ1AIN69.OQ4H.HZEn9a0sYOAzvi8FXWyLpnpug.W', 1);

INSERT INTO credentials(username, password, customer_id)
VALUES ('P.Johnson', '$2b$10$3d8V0XZdnSS/mdGAgoUaY.IF9MXQa70liq7aXS4Eyne/auXxZtB46', 3);

INSERT INTO credentials(username, password, customer_id)
VALUES ('L.Williams', '$2b$10$9BLq3b2fBD56PLaRJljsleG8zNlbRnV0jdAWZ4KCFm3HKxi9t5Ngy', 2);
