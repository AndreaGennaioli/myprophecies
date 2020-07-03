let socket = io();

$(document).ready(function () {
    // click() per il bottone #btn-send
    $('#btn-send').click(function () {
        let name = $('#username').val();
        let time = $('#picker').val();
        let prophecy = $('#prophecy').val();
        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);


        console.log(id);


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

});

// click() per il bottone #btn-like -> per mettere mi piace
$(document).on('click', '#b', function () {
    if ($(this).children('input').attr('src') == './img/like.png') {
        let id = $(this).children('input').attr('id');
        console.log(id);

        $(this).children('input').attr('src', './img/liked.png');

        let args = $(this).html().split('>');
        let i = parseInt(args[1]);
        i += 1;
        console.log(args);
        $(this).html(args[0] + '>' + i);
        socket.emit('like', id);
    } else {
        let id = $(this).children('input').attr('id');
        console.log(id);

        $(this).children('input').attr('src', './img/like.png');

        let args = $(this).html().split('>');
        let i = parseInt(args[1]);
        i -= 1;
        console.log(args);
        $(this).html(args[0] + '>' + i);
        socket.emit('unlike', id);
    }
});

socket.on('updateList', (list) => {
    console.log(list);
    $('#prophecies-list').html('');
    list.prophecies.forEach((p) => {
        if ((p.name || p.date || p.prophecy) == '') {
            return;
        }
        console.log(p.name);
        const template = $('#new-prophecy').html();
        const html = Mustache.render(template, {
            name: ' ' + p.name,
            date: ' ' + p.date,
            prophecy: ' ' + p.prophecy,
            likes: p.likes,
            id: p.id,
        });

        console.log(html);

        const div = document.createElement('li');
        div.setAttribute('class', 'prophecy');
        div.innerHTML = html;

        $('#prophecies-list').append(div);
    });
});