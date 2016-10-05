<?php
require_once '../utils.php';

?>
<!DOCTYPE html>
<html>
    <head></head>
    <link rel="stylesheet" type="text/css" href="direct.css">
    <body>
        <div class="container">
            <div class="p-before" style="margin-top: 10px;"><?=paragraphs();?></div>
            <div class="ad"></div>
            <div class="p-after"><?=paragraphs();?></div>
        </div>

        <div class="fixed">
            <div class="form left">
                <form id="form">
                    <div class="form-row">
                        <label>Tag url
                            <input type="text" placeholder="" id="tag">
                        </label>
                    </div>
                    <div class="form-row">
                        <div>Player type</div>
                        <ul>
                            <li>
                                <input type="radio" name="type" value="1" id="preroll" checked>
                                <label for="preroll">Pre-roll</label>
                            </li>
                            <li>
                                <input type="radio" name="type" value="2" id="outstream">
                                <label for="outstream">Outstream</label>
                            </li>
                        </ul>
                    </div>
                    <div class="form-row right">
                        <button>Test</button>
                    </div>
                </form>
            </div>

            <div class="console">
                <label>Console
                    <textarea rows="20" id="output"></textarea>
                </label>
            </div>
        </div>

        <script src="direct.js"></script>
    </body>
</html>