module('Drag Range Option', {
    setup: function(){
        this.input = $('<input type="text" value="01-03-2011">')
                        .appendTo('#qunit-fixture')
                        .datepicker({format: 'dd-mm-yyyy'})
                        .focus();
        this.dp = this.input.data('datepicker');
        this.picker = this.dp.picker;
    },
    teardown: function(){
        this.picker.remove();
    }
});

/** Test that dragging does nothing when dragRange is disabled */
test('dragRange disabled does not change selection', function(){
    var start = this.picker.find('.datepicker-days tbody td.day:not(.old):first');
    var end = this.picker.find('.datepicker-days tbody td.day:not(.old):eq(2)');
    start.trigger('mousedown');
    end.trigger('mouseover');
    end.trigger('mouseup');

    equal(this.dp.dates.length, 1, 'only one date selected');
    datesEqual(this.dp.dates[0], UTCDate(2011, 2, 1));
});

/** Test that dragging selects range and triggers event when enabled */
test('dragRange enabled selects range', function(){
    this.dp.remove();
    this.input.datepicker({format: 'dd-mm-yyyy', dragRange: true}).focus();
    this.dp = this.input.data('datepicker');
    this.picker = this.dp.picker;

    var triggered = 0,
        startDate, endDate;
    this.input.on('dragRange', function(e){
        triggered++;
        startDate = e.dates[0];
        endDate = e.dates[1];
    });

    var start = this.picker.find('.datepicker-days tbody td.day:not(.old):first');
    var end = this.picker.find('.datepicker-days tbody td.day:not(.old):eq(2)');
    start.trigger('mousedown');
    end.trigger('mouseover');
    end.trigger('mouseup');

    equal(triggered, 1, 'dragRange event triggered');
    datesEqual(startDate, UTCDate(2011, 2, 1));
    datesEqual(endDate, UTCDate(2011, 2, 3));
    equal(this.dp.dates.length, 2, 'range of two dates selected');
    datesEqual(this.dp.dates[0], UTCDate(2011, 2, 1));
    datesEqual(this.dp.dates[1], UTCDate(2011, 2, 3));
});
