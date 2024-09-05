<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = htmlspecialchars(trim($_POST['name']));
        $phone = htmlspecialchars(trim($_POST['phone']));
        $model = htmlspecialchars(trim($_POST['model']));

        if (empty($name) || empty($phone) || empty($model)) {
            echo "<div class='popover'>Все поля обязательны для заполнения.</div>";
        } else {
            $to = "s1digital@ya.ru";
            $subject = "Новое бронирование фудтрака";
            $body = "Имя: $name\nТелефон: $phone\nМодель фудтрака: $model";
            $headers = "From: s1digital@ya.ru\r\n";
            $headers .= "Reply-To: s1digital@ya.ru\r\n";
            $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

            if (mail($to, $subject, $body, $headers)) {
                echo "<div class='success-message'>Сообщение успешно отправлено.</div>";
            } else {
                echo "<div class='error-message'>Ошибка при отправке сообщения.</div>";
            }
        }
    }
?>