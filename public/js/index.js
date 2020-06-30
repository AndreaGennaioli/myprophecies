let socket = io();

// click() per il bottone #btn-send
$('#btn-send').click(function () {
    var name = $('#username').val();
    var time = $('#picker').val();
    var prophecy = $('#prophecy').val();

    if ((name || time || prophecy) == '') {
        return alert('Please enter all required fields')
    }

    var obj_prophecy = new Prophecy(name, time, prophecy);
    console.log(obj_prophecy);

    $('#username').val('');
    $('#picker').val('');
    $('#prophecy').val('');

    socket.emit('emitNew', obj_prophecy);
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
            likes: p.likes
        });

        console.log(html);

        const div = document.createElement('li');
        div.setAttribute('class', 'prophecy');
        div.innerHTML = html;

        $('#prophecies-list').append(div);
    });
});
