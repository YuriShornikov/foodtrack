<?php
header('Content-Type: application/json');

// Подключаемся к базе данных
$conn = pg_connect("host=localhost dbname=foodtrack user=postgres password=Irregularlypostgres2024!");
if (!$conn) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$startDate = $_GET['start_date'];
$endDate = $_GET['end_date'];

// Получаем ID фудтраков, которые заняты в выбранный диапазон дат
$query = "
    SELECT DISTINCT truck_id
    FROM bookings
    WHERE 
        (start_date <= $2 AND end_date >= $1)
";
$result = pg_query_params($conn, $query, [$startDate, $endDate]);

if (!$result) {
    echo json_encode(['error' => 'Query failed']);
    exit;
}

$unavailableTrucks = [];
while ($row = pg_fetch_assoc($result)) {
    $unavailableTrucks[] = $row['truck_id'];
}

pg_close($conn);

// Возвращаем результат в формате JSON
echo json_encode(['unavailableTrucks' => $unavailableTrucks]);
?>
