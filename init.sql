/* positionName
company
location  -  need to figure something out
url?
id
scrapedAt
createdAt
description
externalApplyLink?
searchCity?
searchTerm?
requirements? if it can be parsed out
category? */



CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  vendorID text NOT NULL,
  positionName text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  searchArea text NOT NULL,
  searchTerm text NOT NULL,
  scrapedAt timestamp NOT NULL,

  createdAt timestamp NOT NULL DEFAULT now(),
  postedAt timestamp DEFAULT NULL,
  salary text DEFAULT NULL,
  benefits text DEFAULT NULL,
  requirements text DEFAULT NULL,
  description text DEFAULT NULL,
  externalApplyLink text DEFAULT NULL

);

 VALUES ('indeed', 'Software Engineer', 'Google', 'Mountain View, CA', 'San Francisco Bay Area', 'Software Engineer', '2018-01-01 00:00:00');


  /* scrapingMethod text NOT NULL, */

  /* requirements text, */
  /* category text DEFAULT NULL, */

/* in postgresql */
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  vendorID text NOT NULL,
  positionName text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  url text DEFAULT NULL,
  scrapedAt date NOT NULL,
  createdAt date NOT NULL DEFAULT now(),
  postedAt date DEFAULT NULL,
  description text DEFAULT NULL,
  externalApplyLink text DEFAULT NULL
);