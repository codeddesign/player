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
                padding: 0 0px 10px 0;
            }
        </style>

        <div style="max-width: 100%;margin: 0 auto;padding-top: 50px">
            <div style="float: left; max-width: 70%;">
                <?=paragraphs(2);?>
                <script src="/p1.js"></script>
                <?=paragraphs(5);?>
                <div style="min-height: 10px;background: yellow;"><script src="/p2.js"></script></div>
                <?=paragraphs(15);?>
            </div>
            <div style="float: right;max-width: 30%;text-align: left;margin-top: 20px;background-color: rgb(210, 243, 255);">
                <div style="padding-bottom: 10px;">Sponsors</div>
                <div>
                    <script src="/p3.js"></script>
                </div>
                <div><?=paragraphs();?></div>
            </div>
        </div>
    </body>
</html>