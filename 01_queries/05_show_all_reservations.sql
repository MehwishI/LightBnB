SELECT r.id, p.title, r.start_date,p.cost_per_night, AVG(a.rating) as average_rating
FROM reservations r
JOIN properties p
ON r.property_id =p.id
JOIN property_reviews a
ON a.property_id = p.id
WHERE r.guest_id=1
GROUP BY r.id, p.id
ORDER BY r.start_date
LIMIT 10