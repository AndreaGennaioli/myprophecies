let socket = io();
let recent = 'standard';

$(document).ready(function () {
    // click() per il bottone #btn-send
    $('#btn-send').click(function () {
        let name = $('#username').val();
        let time = $('#picker').val();
        let prophecy = $('#prophecy').val();
        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        if ((name || time || prophecy) == '') {
            return alert('Please enter all required fields')
        }

        let obj_prophecy = new Prophecy(name, time, prophecy, id);
        console.log(obj_prophecy);

        $('#username').val('');
        $('#picker').val('');
        $('#prophecy').val('');

        socket.emit('emitNew', obj_prophecy);
    });

    $("#sortby").click(function () {
        if (recent == $("#sortby").val()) return;
        recent = $("#sortby").val();
        socket.emit('req', $("#sortby").val());
    });
});


// click() per il bottone #btn-like -> per mettere mi piace
$(document).on('click', '#b', function () {
    if ($(this).children('input').attr('src') == './img/like.png') {
        let id = $(this).children('input').attr('id');

        $(this).children('input').attr('src', './img/liked.png');

        let args = $(this).html().split('>');
        let i = parseInt(args[1]);
        i += 1;
        $(this).html(args[0] + '>' + i);
        socket.emit('like', id);
    } else {
        let id = $(this).children('input').attr('id');

        $(this).children('input').attr('src', './img/like.png');

        let args = $(this).html().split('>');
        let i = parseInt(args[1]);
        i -= 1;
        $(this).html(args[0] + '>' + i);
        socket.emit('unlike', id);
    }
});

function compareFunction(a, b) {
    if (a.likes > b.likes) return -1;
    else if (a.likes < b.likes) return 1;
    else return 0;
}

var b = false;

socket.on('updateList', (obj) => {
    upList(obj.prophecies, obj.opts);
});

function upList(list, opts) {
    console.log(opts);
    $('#prophecies-list').html('');

    // RIORDINA PER IL PIU RECENTE
    if (opts == 'standard') {
        list.prophecies.forEach((p) => {
            if ((p.name || p.date || p.prophecy) == '') {
                return;
            }
            const template = $('#new-prophecy').html();
            const html = Mustache.render(template, {
                name: ' ' + p.name,
                date: ' ' + p.date,
                prophecy: ' ' + p.prophecy,
                likes: p.likes,
                id: p.id,
            });

            const div = document.createElement('li');
            div.setAttribute('class', 'prophecy');
            div.innerHTML = html;

            $('#prophecies-list').append(div);
        });
    }

    // RIORDINA PER I LIKE
    else if (opts == 'likes') {
        list.prophecies.sort(compareFunction);
        list.prophecies.forEach((p) => {
            if ((p.name || p.date || p.prophecy) == '') return;

            const template = $('#new-prophecy').html();
            const html = Mustache.render(template, {
                name: ' ' + p.name,
                date: ' ' + p.date,
                prophecy: ' ' + p.prophecy,
                likes: p.likes,
                id: p.id,
            });

            const div = document.createElement('li');
            div.setAttribute('class', 'prophecy');
            div.innerHTML = html;

            $('#prophecies-list').append(div);
        });
    }
    // ERRORE
    else console.error('opts non validi per la funzione update list')
}