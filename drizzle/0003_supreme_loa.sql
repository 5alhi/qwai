CREATE TABLE `visitor_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageViewId` int,
	`sessionId` varchar(128),
	`eventType` varchar(64) NOT NULL,
	`eventTarget` varchar(512),
	`eventText` varchar(512),
	`eventHref` varchar(1024),
	`positionX` int,
	`positionY` int,
	`scrollPercent` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `page_views` ADD `referrerDomain` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `utmSource` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `utmMedium` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `utmCampaign` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `utmContent` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `utmTerm` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `isNewVisitor` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `page_views` ADD `browser` varchar(128);--> statement-breakpoint
ALTER TABLE `page_views` ADD `browserVersion` varchar(64);--> statement-breakpoint
ALTER TABLE `page_views` ADD `os` varchar(128);--> statement-breakpoint
ALTER TABLE `page_views` ADD `osVersion` varchar(64);--> statement-breakpoint
ALTER TABLE `page_views` ADD `screenWidth` int;--> statement-breakpoint
ALTER TABLE `page_views` ADD `screenHeight` int;--> statement-breakpoint
ALTER TABLE `page_views` ADD `viewportWidth` int;--> statement-breakpoint
ALTER TABLE `page_views` ADD `viewportHeight` int;--> statement-breakpoint
ALTER TABLE `page_views` ADD `colorDepth` int;--> statement-breakpoint
ALTER TABLE `page_views` ADD `language` varchar(32);--> statement-breakpoint
ALTER TABLE `page_views` ADD `connectionType` varchar(64);--> statement-breakpoint
ALTER TABLE `page_views` ADD `ip` varchar(64);--> statement-breakpoint
ALTER TABLE `page_views` ADD `countryCode` varchar(8);--> statement-breakpoint
ALTER TABLE `page_views` ADD `region` varchar(128);--> statement-breakpoint
ALTER TABLE `page_views` ADD `city` varchar(128);--> statement-breakpoint
ALTER TABLE `page_views` ADD `latitude` varchar(32);--> statement-breakpoint
ALTER TABLE `page_views` ADD `longitude` varchar(32);--> statement-breakpoint
ALTER TABLE `page_views` ADD `timezone` varchar(64);--> statement-breakpoint
ALTER TABLE `page_views` ADD `isp` varchar(256);--> statement-breakpoint
ALTER TABLE `page_views` ADD `scrollDepth` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `page_views` ADD `timeOnPage` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `page_views` ADD `pageLoadTime` int;