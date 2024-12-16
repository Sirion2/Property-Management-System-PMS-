-- AUTHOR: SIRION2
-- DATE: 11:15 P.M 16/IX/2024

-- START --

-- Creates the database --
--CREATE DATABASE pmsdb;

-- Connects to database --
\connect pmsdb;

-- Creates Schema --
CREATE SCHEMA pmsdb;

-- Creates System user of pms --
CREATE USER pms_system WITH ENCRYPTED PASSWORD 'password_here';

-- Grants schema permissions to pms user --
GRANT USAGE, CREATE ON SCHEMA pmsdb TO pms_system;

-- Creates enums for table users --
CREATE TYPE userRolEnum AS ENUM ('0x1bc', '0x284', '0x308');
CREATE TYPE userStatusEnum AS ENUM ('0x01', '0x02');

-- Drops tables if exists --
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- Creates table users --
CREATE TABLE pmsdb.agents (
	"id" SERIAL PRIMARY KEY,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
	"phoneNumber" VARCHAR NOT NULL UNIQUE,
	"profileImage" BYTEA NOT NULL,
        "password" VARCHAR NOT NULL,
        "rol" userRolEnum NOT NULL,
 	"status" userStatusEnum NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
	"createdBy" INTEGER NOT NULL,
	"updatedAt" TIMESTAMP NULL,
	"updatedBy" INTEGER NULL
);

-- Creates table properties --
CREATE TABLE pmsdb.properties (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "description" VARCHAR NOT NULL,
        "location" VARCHAR NOT NULL,
        "price" NUMERIC NOT NULL,
        "image_1" BYTEA NOT NULL,
        "image_2" BYTEA NOT NULL,
        "image_3" BYTEA NULL,
        "image_4" BYTEA NULL,
	"assignedTo" INTEGER NOT NULL,
        "publish" BOOLEAN NOT NULL,
	"sold" BOOLEAN NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "createdBy" INTEGER NOT NULL,
   	"updatedAt" TIMESTAMP NULL,
    	"updatedBy" INTEGER NULL,
	"deleted" BOOLEAN NULL,

CONSTRAINT "fk_agents"
	FOREIGN KEY("assignedTo")
	REFERENCES pmsdb.agents("id"),

CONSTRAINT "fk_agents1"
	FOREIGN KEY("createdBy")
	REFERENCES pmsdb.agents("id")
);		

-- Grant sequence permissions to pm user
GRANT USAGE, SELECT ON SEQUENCE pmsdb.agents_id_seq TO pms_system;
GRANT USAGE, SELECT ON SEQUENCE pmsdb.properties_id_seq TO pms_system;

-- Grant permissions to pms user
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE pmsdb.agents TO pms_system;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE pmsdb.properties TO pms_system;
-- END --
