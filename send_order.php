<?php
// Убедитесь, что выводите только JSON и ничего другого
header('Content-Type: application/json');

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['phone']) && isset($data['items']) && isset($data['total'])) {
    $name = htmlspecialchars($data['name']);
    $phone = htmlspecialchars($data['phone']);
    $paymentMethod = htmlspecialchars($data['paymentMethod']);
    $address = htmlspecialchars($data['address']);
    $items = $data['items'];

    $total = $data['total'];

    // Присоединение к базе данных
    $conn = pg_connect("host=localhost dbname=foodtrack user=postgres password=Irregularlypostgres2024!");

    if (!$conn) {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось подключиться к базе данных']);
        exit;
    }

    // Вставка заказа в таблицу orders
    $query = "INSERT INTO orders (name, phone, payment_method, address, total) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    $result = pg_query_params($conn, $query, [$name, $phone, $paymentMethod, $address, $total]);

    if ($result) {
        $orderId = pg_fetch_result($result, 0, 'id');

        // Вставка товаров в таблицу order_items
        $query = "INSERT INTO order_items (order_id, name, quantity, price, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)";
        foreach ($items as $item) {
            pg_query_params($conn, $query, [
                $orderId,
                $item['name'],
                $item['quantity'],
                $item['price'],
                $item['startDate'] ?? null,
                $item['endDate'] ?? null
            ]);
        }

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка при выполнении запроса']);
    }

    pg_close($conn);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Некоторые обязательные поля отсутствуют']);
}
?>
