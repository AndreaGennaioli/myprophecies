let socket = io();

// click() per il bottone #btn-send
$('#btn-send').click(function () {
    var name = $('#username').val();
    var time = $('#picker').val();
    var prophecy = $('#prophecy').val();

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
        console.log(p.name);
        const template = $('#new-prophecy').html();
        const html = Mustache.render(template, p);

        console.log(html);

        const div = document.createElement('li');
        div.setAttribute('class', 'list-group-item prophecy');
        div.innerHTML = html;

        $('#prophecies-list').append(div);
    });
});