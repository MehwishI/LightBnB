SELECT p.city, count(r.id) as number_of_reservations
FROM reservations r
JOIN properties p
ON r.property_id = p.id
GROUP BY p.city
ORDER BY number_of_reservations DESC