DROP DATABASE WritersDenDB;

CREATE DATABASE WritersDenDB charset 'utf8';
 
USE WritersDenDB;

CREATE TABLE Users(
	ID int primary key AUTO_INCREMENT NOT NULL, 
	username varchar(255) NOT NULL,
    pass varchar(255) NOT NULL, 
    followerCount int NOT NULL DEFAULT 0,
    overallRating int NOT NULL DEFAULT 0,
    email varchar(255) NOT NULL,
    Verified char NOT NULL Default 'n',
    Bio Text
);

CREATE TABLE Books(
	Id int  primary key AUTO_INCREMENT NOT NULL,
    Title varchar(255) NOT NULL,
    AuthorId int NOT NULL,
    Rating int NOT NULL DEFAULT 0,
	BookPosted char(1) default 'n',
    foreign key (AuthorID) references Users(ID) ON DELETE CASCADE
);


CREATE TABLE Chapters(
	Id int primary key auto_increment NOT NULL,
    BookId int NOT NULL,
    Content blob,
    ChapterTitle varchar(255) default 'Твоето заглавие',
    ChapterPosted char default 'n',
    foreign key(BookId) references Books(Id) ON DELETE CASCADE
);

CREATE TABLE BookComments(
	Id int primary key auto_increment not null,
    Content Text,
    BookId int not null,
    PosterId int not null,
    Foreign Key(BookId) References Books(Id) ON DELETE CASCADE,
    Foreign Key(PosterId) References Users(Id) ON DELETE NO ACTION
);

Create Table ChapterComments(
	ID int primary key auto_increment NOT NULL, 
	Content Text,
    ChapterId int not null,
    PosterId int NOT NULL,
    Foreign Key(ChapterId) References Chapters(Id) ON DELETE CASCADE,
    Foreign Key(PosterId) References Users(Id) ON DELETE NO ACTION
);

Create Table Followers(
	Id int primary key NOT NULL AUTO_INCREMENT,
    FollowerId int NOT NULL,
    FollowingId int NOT NULL,
    foreign key(FollowerId) references Users(ID) ON DELETE NO ACTION,
    foreign key(FollowingId) references Users(ID) ON DELETE NO ACTION
);


ALTER TABLE BookComments
ADD COLUMN PostedOn DATETIME DEFAULT CURRENT_TIMESTAMP;

Alter Table Chapters
Add Column NextChapter Integer,
Add Column PreviousChapter Integer,
Add Foreign Key (NextChapter) REFERENCES Chapters(Id) On Delete Set NULL,
Add Foreign Key (PreviousChapter) References Chapters(Id) On Delete Set NULL

-- 
-- 
-- Use WritersDenDB;
-- 
-- Alter Table Chapters
-- 	Drop Column ChapterPosted,
--     Add Column ChapterPosted char(1) default 'n';
-- 	
--     
--     
-- Alter Table Chapters
-- 	Drop Column Title,
--     Add Column ChapterTitle varchar(255) default 'Твоето заглавие';
--     
-- Alter Table Books
-- 	Drop Column BookPosted,
--     Add Column BookPosted char(1) default 'n'; 
-- 
-- 
-- 
-- Use WritersDenDB;
-- 
-- Alter Table Users
-- 	Add Column Bio Text,
--     Add Column Verified char NOT NULL Default 'n';
--     
-- Alter table  Books
-- 	Add Column Rating int NOT NULL DEFAULT 0
--     
-- 
-- 
-- 
-- 
-- 
-- 
-- 
-- 
-- 
-- 