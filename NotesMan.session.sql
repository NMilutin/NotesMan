/*create table notes(
  id serial primary key,
  name varchar(50) not null,
  text varchar(500) not null,
  date date not null,
  background_color char(7) not null check (length(background_color)=7),
  text_color char(7) not null check (length(text_color)=7)
)

create table tasks (
  id serial primary key,
  name varchar(50) not null,
  text varchar(500) not null,
  date date not null,
  done boolean default false,
  background_color char(7) not null check (length(background_color)=7),
  text_color char(7) not null check (length(text_color)=7)
)

create table goals(
  id serial primary key,
  name varchar(50) not null,
  text varchar(500) not null,
  date date not null,
  background_color char(7) not null check (length(background_color)=7),
  text_color char(7) not null check (length(text_color)=7)
)

create table task_goal(
  id serial primary key,
  task_id int references tasks (id),
  goal_id int references goals (id)
)*/
--TODO: nauci kako da hashujes lozinke i ostale zajebancije