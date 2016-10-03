<?php
require_once '../_utils.php';

$tags_path = realpath(__DIR__.'/../../../test_tags.php');

if (!file_exists($tags_path)) {
    exit('there\'s not test_tags file');
}

$tags = require_once $tags_path;
if (!isset($_GET['n']) || !isset($tags[trim($_GET['n'])])) {
    exit('Tag name is missing or doesn\'t exist.');
}

// set name
$name = trim($_GET['n']);

// set campaign type
$campaignType = 'standard';
if (stripos($name, 'stream')) {
    $campaignType = 'onscrolldisplay';
}

// set tag
$tag = $tags[$name];
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
        <script>
            window.__tag = <?=json_encode($tag);?>;
            window.__type = '<?=$campaignType;?>';
        </script>
        <?= ($campaignType != 'standard') ? paragraphs() : paragraphs(1);?>

        <div style="background-color: rgb(210, 243, 255);min-height: 10px;">
            <script src="/t1.js"></script>
        </div>

        <?=paragraphs();?>
    </body>
</html>