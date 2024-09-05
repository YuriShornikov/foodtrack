<?php
header('Content-Type: application/json');

$conn = pg_connect("host=localhost dbname=foodtrack user=postgres password=Irregularlypostgres2024!");
if (!$conn) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Обработка POST-запросов (например, бронирование дат)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['truck_id']) || !isset($input['start_date']) || !isset($input['end_date'])) {
        echo json_encode(['error' => 'truck_id, start_date, или end_date отсутствуют']);
        exit;
    }

    $truckId = intval($input['truck_id']);
    $startDate = $input['start_date'];
    $endDate = $input['end_date'];

    // Вставляем данные бронирования в базу данных
    $query = "INSERT INTO bookings (truck_id, start_date, end_date, status) 
              VALUES ($1, $2, $3, 'booked')
              ON CONFLICT (truck_id, start_date, end_date) 
              DO UPDATE SET status = 'booked' WHERE bookings.start_date = $2 AND bookings.end_date = $3";
    
    $result = pg_query_params($conn, $query, [$truckId, $startDate, $endDate]);

    if (!$result) {
        echo json_encode(['error' => 'Booking failed']);
        pg_close($conn);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Booking successful']);
    pg_close($conn);
    exit;
}

// Обработка GET-запросов (например, получение забронированных диапазонов)
if (!isset($_GET['truck_id'])) {
    echo json_encode(['error' => 'truck_id отсутствует']);
    exit;
}

$truckId = intval($_GET['truck_id']);

// Получаем все забронированные диапазоны для данного фудтрака
$query = "SELECT start_date, end_date FROM bookings WHERE truck_id = $1";
$result = pg_query_params($conn, $query, [$truckId]);

if (!$result) {
    echo json_encode(['error' => 'Query failed']);
    exit;
}

$bookedDates = [];

while ($row = pg_fetch_assoc($result)) {
    // Генерация всех дат внутри диапазона от start_date до end_date
    $period = new DatePeriod(
        new DateTime($row['start_date']),
        new DateInterval('P1D'),
        (new DateTime($row['end_date']))->modify('+1 day')
    );

    foreach ($period as $date) {
        $bookedDates[] = $date->format('Y-m-d');
    }
}

pg_close($conn);

// Возвращаем результат в формате JSON
echo json_encode([
    'bookedDates' => $bookedDates
]);
?>
