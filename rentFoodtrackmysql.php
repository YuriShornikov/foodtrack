<?php
header('Content-Type: application/json');

// Подключаемся к базе данных MySQL
$conn = new mysqli("localhost", "username", "password", "foodtrack");

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Обработка POST-запросов (например, бронирование дат)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['truck_id'])  !isset($input['start_date'])  !isset($input['end_date'])) {
        echo json_encode(['error' => 'truck_id, start_date, или end_date отсутствуют']);
        exit;
    }

    $truckId = intval($input['truck_id']);
    $startDate = $conn->real_escape_string($input['start_date']);
    $endDate = $conn->real_escape_string($input['end_date']);

    // Вставляем данные бронирования в базу данных
    $query = "INSERT INTO bookings (truck_id, start_date, end_date, status) 
              VALUES ('$truckId', '$startDate', '$endDate', 'booked')
              ON DUPLICATE KEY UPDATE status = 'booked', start_date = '$startDate', end_date = '$endDate'";
    
    if (!$conn->query($query)) {
        echo json_encode(['error' => 'Booking failed: ' . $conn->error]);
        $conn->close();
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Booking successful']);
    $conn->close();
    exit;
}

// Обработка GET-запросов (например, получение забронированных диапазонов)
if (!isset($_GET['truck_id'])) {
    echo json_encode(['error' => 'truck_id отсутствует']);
    exit;
}

$truckId = intval($_GET['truck_id']);

// Получаем все забронированные диапазоны для данного фудтрака
$query = "SELECT start_date, end_date FROM bookings WHERE truck_id = '$truckId'";
$result = $conn->query($query);

if (!$result) {
    echo json_encode(['error' => 'Query failed: ' . $conn->error]);
    $conn->close();
    exit;
}

$bookedDates = [];

while ($row = $result->fetch_assoc()) {
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

$conn->close();

// Возвращаем результат в формате JSON
echo json_encode([
    'bookedDates' => $bookedDates
]);
?>