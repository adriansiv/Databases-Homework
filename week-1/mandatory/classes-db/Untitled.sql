DROP TABLE IF EXISTS Mentors;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS assisting;

create table Mentors (
id        			SERIAL PRIMARY KEY,
name				VARCHAR (30) not null,
years_in_glasgow 	INT not null,
address				VARCHAR (80) not null,
favorite_language 	VARCHAR (30) not null
);

create table Students (
id 					SERIAL primary key,
name				VARCHAR (30) not null,
address 			VARCHAR (30) not null,
graduated			BOOLEAN
);

create table classes (
id 						SERIAL primary key,
has_a_leading_mentor	BOOLEAN,
class_topic				VARCHAR (15),
class_date				DATE,
class_location			VARCHAR (30) 	
);

create table assisting (
id						SERIAL primary key,
student_id				INT references Students(id),
class_id 				INT references classes(id)
);


-- Mentors --
insert into Mentors (name, years_in_glasgow, address, favorite_language) values ('Ronald', 7, '111 Queen St, Royal Exchange Square, Glasgow G1 3AH, Reino Unido', 'Git');
insert into Mentors (name, years_in_glasgow, address, favorite_language) values ('Peter', 4, '350 Sauchiehall St, Glasgow G2 3JD, Reino Unido', 'CSS');
insert into Mentors (name, years_in_glasgow, address, favorite_language) values ('Gabriel', 9, '96 Queen St, Glasgow G1 3DN, Reino Unido', 'JavaScript');
insert into Mentors (name, years_in_glasgow, address, favorite_language) values ('Jeff', 4, '50 Pacific Quay, Glasgow G51 1EA, Reino Unido', 'React');
insert into Mentors (name, years_in_glasgow, address, favorite_language) values ('John', 4, '50 Pacific Quay, Glasgow G51 1EA, Reino Unido', 'Express');

-- Students --
insert into Students (name, address, graduated) values ('Jaime', 'One Street', TRUE);
insert into Students (name, address, graduated) values ('Luca', 'Two Street', TRUE);
insert into Students (name, address, graduated) values ('Richard', 'Three Street', FALSE);
insert into Students (name, address, graduated) values ('Monica', 'Four Street', TRUE);
insert into Students (name, address, graduated) values ('Jessica', 'Five Street', FALSE);
insert into Students (name, address, graduated) values ('Jenniffer', 'Six Street', TRUE);
insert into Students (name, address, graduated) values ('Rhina', 'Seven Street', TRUE);
insert into Students (name, address, graduated) values ('Javier', 'Eight Street', TRUE);
insert into Students (name, address, graduated) values ('Marco', 'Nine Street', TRUE);
insert into Students (name, address, graduated) values ('Charles', 'Two Street', FALSE);

-- Classes --
insert into classes (has_a_leading_mentor, class_topic, class_date, class_location) values (true, 'JavaScript', '2021-05-18', 'Glasgow');
insert into classes (has_a_leading_mentor, class_topic, class_date, class_location) values (false, 'NodeJs', '2021-06-27', 'Glasgow');

-- Assisting --
insert into assisting(student_id, class_id) values(1, 1);
insert into assisting(student_id, class_id) values(2, 1);
insert into assisting(student_id, class_id) values(7, 1);
insert into assisting(student_id, class_id) values(3, 2);


select * from Mentors;
select * from Students;
select * from classes;
select * from assisting;


-- Retrieve all the mentors who lived more than 5 years in Glasgow --
SELECT * from Mentors WHERE years_in_glasgow >= 5;

-- Retrieve all the mentors whose favourite language is Javascript --
SELECT * FROM Mentors WHERE favorite_language = 'JavaScript';

-- Retrieve all the students who are CYF graduates --
select * from Students where graduated = true;

-- Retrieve all the classes taught before June this year --
select * from classes where class_date < '2021-06-01';

-- Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).--
select student_id from assisting where class_id = 1;
select * from Students where id = (select student_id from assisting where class_id = 1); 
select s.name from Students s inner join assisting a on a.student_id = s.id where a.class_id = 1;



