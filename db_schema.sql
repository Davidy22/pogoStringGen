CREATE TABLE IF NOT EXISTS "users" (
	"uid"	TEXT NOT NULL UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"textloc"	TEXT NOT NULL UNIQUE,
	"image"	TEXT NOT NULL,
	PRIMARY KEY("uid")
);
CREATE TABLE IF NOT EXISTS "sessions" (
	"sesscount"	INTEGER NOT NULL UNIQUE,
	"uid"	TEXT NOT NULL,
	"sid"	TEXT NOT NULL UNIQUE,
	FOREIGN KEY("uid") REFERENCES "users"("uid"),
	PRIMARY KEY("sesscount" AUTOINCREMENT)
);
CREATE TRIGGER three_logins AFTER INSERT ON sessions
BEGIN
	DELETE FROM sessions WHERE sesscount <= (SELECT sesscount FROM sessions where uid = new.uid ORDER BY sesscount DESC LIMIT 3, 1);
END;
