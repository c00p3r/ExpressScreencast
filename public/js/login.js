$('#login-form').on('submit', function () {
    const $form = $(this);
    const $form_errors = $('.form-errors', $form)

    $('.alert-body', $form_errors).html('');
    $form_errors.hide();

    $(":submit", $form).text("Loading...").prop('disabled', true);

    $.ajax({
        url: "/login",
        method: "POST",
        data: $form.serialize(),
    }).done(() => {
        window.location.href = "/chat";
    }).fail((XHR) => {
        const resp = JSON.parse(XHR.responseText);
        let $err_list = $('<ul />');
        resp.errors.forEach(function (error) {
            let li = $('<li />').text(error);
            $err_list.append(li);
            $('.alert-body', $form_errors).html($err_list);
            $form_errors.show();
        });
    }).always(() => {
        $(":submit", $form).text("Submit").prop('disabled', false);
    });
    return false;
});
