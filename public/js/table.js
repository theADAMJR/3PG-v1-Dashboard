$(document).ready(() =>
{
    $('#table').DataTable(
    {
        "bInfo": false,
        "sPaginationType": "simple",
        "responsive": true,
        "oLanguage": 
        { 
            "dom": 'Blfrtip',
            "sLengthMenu": "Size: _MENU_ ", 
            "sZeroRecords": "Nothing was found 😢",
            "sEmptyTable": "There's nothing to see here...",
        }
    });
    $(`select[name="table_length"]`).addClass("form-control col-xs-12 form-control-sm").parent().addClass("ml-2");
    $(`input[type="search"]`).addClass("form-control col-xs-12 form-control-sm mr-2");
});