DELETE from jobs
WHERE id IN 
( 
SELECT id 
FROM (
    SELECT 
	id,
        vendorid, 
        searchterm, 
        searcharea, 
        positionname, 
        scrapedat, 	
        ROW_NUMBER() OVER (
            PARTITION BY 
                vendorid, 
        	searchterm, 
        searcharea 
            ORDER BY 
                vendorid, 
        	searchterm, 
        searcharea,
	scrapedat
	DESC
        ) AS row_num
     FROM 
        jobs
) j
WHERE row_num > 1);
