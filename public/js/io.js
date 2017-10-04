const socket = io.connect();

let $room = $('#room');
let $form = $room.find('form');
let $input = $form.find(':input');
let $history = $room.find('ul');

$form.submit(function () {
    let text = $input.val();
    $input.val('');

    socket.emit('message_out', text, function () {
        $('<li>')
            .append($('<span class="badge badge-light">').text('me'))
            .append($('<span class="ml-1">').text(text))
            .appendTo($history);
    });

    return false;
});

$('#logout-form').submit(function () {
    socket.emit('session:reload', socket.id);
});

function printStatus(status) {
    $('<li>').append($('<i class="text-warning">').text(status)).appendTo($history);
}

socket
    .on('message_in', function (email, text) {
        $('<li>')
            .append($('<span class="badge badge-secondary">').text(email))
            .append($('<span class="ml-1">').text(text))
            .appendTo($history);
    })
    .on('join', (user_email) => {
        $('<li>').append($('<i class="text-success">').text(user_email + ' joined chat')).appendTo($history);
    })
    .on('leave', (user_email) => {
        $('<li>').append($('<i class="text-danger">').text(user_email + ' left chat')).appendTo($history);
    })
    .on('error', function (text) {
        alert('Server error: ' + text);
    })
    .on('connect', function () {
        printStatus("::Connection Established");
        $form.on('submit', sendMessage);
        $input.prop('disabled', false);
    })
    .on('disconnect', function () {
        printStatus("::Connection Lost");
        $form.off('submit', sendMessage);
        $input.prop('disabled', true);
    })
    // Will never happen!
    .on('reconnect_failed', function () {
        alert('Reconnect failed!');
    });

function sendMessage() {
    let text = $input.val();
    socket.emit('message', text, function () {
        $('<li>', {text: text}).appendTo($history);
    });

    $input.val('');
    return false;
}
