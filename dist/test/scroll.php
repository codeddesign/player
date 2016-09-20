<?php
require_once '_utils.php';
?>

<!DOCTYPE html>
<html>
    <head style="width: 100%;height:100%;">
    </head>
    <body style="height: 100%;text-align: center;">
        <style type="text/css">
            p {
                display: block;
                margin: 0 auto;
                width: 640px;
                padding: 10px 0;
            }
        </style>
        <?=paragraphs();?>

        <div style="background-color: rgb(210, 243, 255);min-height: 10px;">
            <script src="/p2.js"></script>
        </div>

        <?=paragraphs();?>
    </body>
</html>