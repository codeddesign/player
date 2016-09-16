<?php
function paragraphs($no = 10) {
    echo '<div class="ps">';

    foreach (range(1, $no) as $a) {
        echo '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';
    }

    echo '</div>';
}
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