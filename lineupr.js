$(document).ready(function(){
    $('.running-order').addClass('container');

    var day_selector = $('<ul></ul>').addClass('nav nav-tabs').attr('role', 'tablist');
    $.each(schedule.program, function(i, val){
        var tab_date = $('<li></li>').attr('role', 'presentation');
        if (i == 0) {
            tab_date.addClass('active');
        }
        var tab_link = $('<a></a>').attr('href', '#ro' + val.event_date).attr('role', 'tab').attr('data-toggle', 'tab').attr('aria-controls', 'ro' + val.event_date);
        tab_link.text(new Date(val.event_date).toDateString());
        
        tab_date.append(tab_link);
        day_selector.append(tab_date);
    });

    $('.running-order').append(day_selector);

  
    // Create the content container
    var container = $('<div class="tab-content"></div>');
    $('.running-order').append(container);

    // Create the Hours div
  
    var div_hours = $('<div></div>').addClass('hours');
    for (i = 10; i <= 27; i++) {
        // hacky!
        var hour = i < 24 ? i : i - 24;
        
        var div_hour = $('<div></div>').addClass('hour').attr('data-time', hour_military(hour));
        div_hour.text(hour_friendly(hour_military(hour)) + " - ");
        
        div_hours.append(div_hour);
    }
    container.append(div_hours);
  
    // For each day of festival
    $.each(schedule.program, function(i, event_day) {
        // Create the container for the day
        var div_event_day = $('<div></div>').attr('role', 'tabpanel').addClass('tab-pane').attr('id', 'ro' + event_day.event_date);
        if (i == 0) {
            div_event_day.addClass('active');
        }
        
        // Create the Stages div
        var div_stages = $('<div></div>').addClass('stages');
        $.each(event_day.running_order, function(i, val) {
            var div_stage = $('<div></div>').addClass('stage').attr('data-name', val.stage_name);
        
            var h5_title = $('<h5></h5>').addClass('stage-title').text(val.stage_name.toUpperCase());
            div_stage.append(h5_title);
      
            div_stages.append(div_stage);
        });
  
        div_event_day.append(div_stages);
  
        // Now for the hard work!
        $.each(event_day.running_order, function(i,stage){
            $.each(stage.acts, function(i, act) {
                var div_act = $('<div></div>').addClass('artist container text-center');
                var p_act = $('<p></p>');
                var span_act = $('<span></span>');
                var strong_act = $('<strong></strong>').text(act.act).append('<br>');
                var small_time = $('<small></small>').append(hour_friendly(act.start_time)).append(' - ').append(hour_friendly(act.end_time));
                strong_act.append(small_time);
                span_act.append(strong_act);
                p_act.append(span_act);
                div_act.append(p_act);
                div_act.css('top', $('.hour[data-time="' + hour_round(act.start_time) + '"]').offset().top + minutes_offset(act.start_time));
                div_act.css('height', act_duration(act.start_time, act.end_time) * 2);
                div_act.css('width', $('.stage[data-name="'+ stage.stage_name +'"] .artists').width());
            
                div_event_day.find('.stage[data-name="'+ stage.stage_name +'"]').append(div_act);
            });
        });
        
        container.append(div_event_day);
    });
});

// Helpers

function hour_military(h) {
    if (h < 0 || h > 24) {
      throw "Invalid hour";
    }
    return h < 10 ? "0" + h + "00" : h + "00";
}

function hour_friendly(h) {
    return h.substring(0,2) + ":" + h.substring(2);
}

function hour_round(h) {
    return h.substring(0,2) + "00";
}

function minutes_offset(h) {
    return parseInt(h.substring(2));
}

function act_duration(start_time, end_time) {
    var start_date = new Date(); // we don't need any specific date
    var end_date = new Date();
  
    start_date.setHours(parseInt(start_time.substring(0,2)));
    start_date.setMinutes(parseInt(start_time.substring(2)));
  
    end_date.setHours(parseInt(end_time.substring(0,2)));
    end_date.setMinutes(parseInt(end_time.substring(2)));
  
    // If the day has changed
    if (parseInt(end_time.substring(0,2)) < parseInt(start_time.substring(0,2))) {
      end_date.setDate(end_date.getDate() + 1);
    }

    var diff = end_date - start_date;
    var minutes = Math.floor(diff / 1000 / 60);
  
    return minutes;
}