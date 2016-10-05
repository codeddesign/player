(function() {
    var $tag = document.querySelector('#tag'),
        $types = document.querySelectorAll('input[name="type"]'),
        $ps = document.querySelectorAll('.p-before p:nth-child(-n+9)'),
        $form = document.querySelector('#form'),
        $ad = document.querySelector('.ad'),
        $output = document.querySelector('#output'),
        type_value = 0,
        type,
        showed = false;

    function hideFirst9() {
        $ps.forEach(function(p) {
            p.style.display = 'none';
        });
    }

    function showFirst9() {
        $ps.forEach(function(p) {
            p.style.display = 'block';
        });
    }

    function clear() {
        showed = false;
        $ad.innerHTML = '';
        $output.value = '';
    }

    function insertAd() {
        window.__tag = { desktop: $tag.value, mobile: $tag.value };

        clear();

        script = document.createElement('script');
        script.src = document.location.protocol + '//' + document.location.host.replace('/test/direct/') + '/d' + type_value + '.js?ts=' + Date.now();
        $ad.appendChild(script);
    }

    $types.forEach(function($el) {
        var checked = $el.getAttribute('checked');
        if (checked != null) {
            type_value = $el.value;
        }

        $el.addEventListener('change', function(ev) {
            type_value = ev.target.value;

            clear();

            if (ev.target.value == '1') {
                hideFirst9();
            }

            if (ev.target.value == '2') {
                showFirst9();
            }
        })
    })

    $form.addEventListener('submit', function(ev) {
        ev.preventDefault();

        switch (type_value) {
            case '2':
                type = 'onscrolldisplay';
            default:
                type = 'standard';
                break;
        }

        insertAd();
    })

    document.addEventListener('amtl:message', function(ev) {
        var d = ev.detail;

        if (d.source == 'app') {
            return false;
        }

        if (!showed && d.source == 'tag') {
            showed = true;

            $output.value += 'Request: ' + d.tag + '\n\n';
        }

        $output.value += d.source + ':\t' + d.statusInfo + ' [status ' + d.status + ']\n';
    })

    // sets
    if (type_value == 1) hideFirst9();

    $tag.focus();
})();
