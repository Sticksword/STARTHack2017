DROP TABLE IF EXISTS COMPANY;
CREATE TABLE COMPANY(
   ID INT PRIMARY KEY     NOT NULL,
   NAME           TEXT    NOT NULL,
   AGE            INT     NOT NULL,
   ADDRESS        CHAR(50),
   SALARY         REAL
);

-- INSERT INTO TABLE_NAME [(column1, column2, column3,...columnN)]  
-- VALUES (value1, value2, value3,...valueN);
