$(function() {
    $('.opacity__slider').slider({
        range: 'min',
        value: 50,
        min: 1,
        max: 100,
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.value );
        }
    });

    $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
});