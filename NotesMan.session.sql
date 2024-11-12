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
)

create table users(
  id serial primary key,
  email text not null unique,
  password_hash text not null
)

alter table notes add user_id int not null;
alter table tasks add user_id int not null;
alter table goals add user_id int not null;

alter table notes add foreign key (user_id) references users(id);
alter table tasks add foreign key (user_id) references users(id);
alter table goals add foreign key (user_id) references users(id);
*/

/*create table sessions(
  id serial primary key,
  user_id int not null,
  created timestamp default now() not null,
  expires timestamp not null,
  foreign key (user_id) references users(id)
);

insert into users(email,password_hash) values('example@example.com',crypt('password',gen_salt('bf')))

insert into notes(name,text,date,background_color,text_color,user_id) values
('Database test note','This is a note added directly to the database for testing purpouses','2024-11-11 12:00:00','#DFDFCF','#000000',1)

insert into tasks(name,text,date,background_color,text_color,done,user_id) values
('Database test task','This is a task added directly with a query','2024-11-11','#DFDFCF','#000000',true,1)

insert into goals(name,text,date,background_color,text_color,user_id) values
('Database test goal','This is a goal added directly with a query','2024-11-11 16:12:10','#DFDFCF','#000000',1)
insert into task_goal(task_id,goal_id) values(1,1)
*/
alter table sessions add session_key_hash text not null