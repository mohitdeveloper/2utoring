$(document).ready(function () {
    //CKEDITOR.replace('htmleditor');

    // Setup the global default datatables
    $('table.datatable').dataTable();

    //setup the global datatables without sorting, filtering or paging
    $('table.datatablenoSortNoFilter').dataTable({ "bSort": false, "bFilter": false, "bPaginate": false });

    // Setup the global datatables without a search
    $('table.datatablenofilter').dataTable({ "bFilter": false, "bPaginate": false });

});