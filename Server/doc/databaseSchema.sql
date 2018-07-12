CREATE DATABASE IF NOT EXISTS NTM_ST
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE NTM_ST;

CREATE TABLE IF NOT EXISTS User (
  username     VARCHAR(32) UNIQUE NOT NULL,
  genHash      CHAR(128)          NOT NULL,
  role         CHAR(16)           NOT NULL DEFAULT 'USER', /*管理员：ADMIN*/
  id           INT                         AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Community (
  owner_id     INT          NOT NULL,
  name         VARCHAR(128) NOT NULL,
  description  VARCHAR(1024),
  rank         INT          NOT NULL DEFAULT 0,
  stastus      VARCHAR(8)   NOT NULL DEFAULT 'PADDING', /* 已通过：USABLE  拒绝申请：REJECTED   不可用：DISABLE */
  id           INT                   AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES User (id)
);
CREATE TABLE IF NOT EXISTS CommunityModifyInfoApplication (
  name         VARCHAR(128) NOT NULL,
  description  VARCHAR(1024),
  community_id INT          NOT NULL,
  user_id INT          NOT NULL,
  status       VARCHAR(8)   NOT NULL DEFAULT 'PADDING', /* 允许：PASSED 拒绝：REJECTED */
  id           INT                   AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (community_id) REFERENCES Community (id),
  FOREIGN KEY (user_id) REFERENCES User (id)
);

CREATE TABLE IF NOT EXISTS ActivityField (
  name         VARCHAR(64) NOT NULL,
  date         DATE        NOT NULL,
  status       VARCHAR(8)  NOT NULL DEFAULT 'IDLE', /* 已占：OCCUPIED */
  id           INT                  AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ActivityFieldApplication (
  field_id     INT        NOT NULL,
  community_id INT        NOT NULL,
  status       VARCHAR(8) NOT NULL DEFAULT 'PADDING', /* 允许：PASSED 拒绝：REJECTED */
  id           INT                 AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES ActivityField (id),
  FOREIGN KEY (community_id) REFERENCES Community (id)
);
