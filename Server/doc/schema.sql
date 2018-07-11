CREATE DATABASE IF NOT EXISTS NTM_ST
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE NTM_ST;

CREATE TABLE IF NOT EXISTS User (
  user_id      INT                         AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(32) UNIQUE NOT NULL,
  genHash      CHAR(128)          NOT NULL,
  role         CHAR(16)           NOT NULL,
  created_time TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP
);