function quote(s) {
    return '"' + s + '"';
}

function removeColon(s) {
    return s.replace(":", "");
}

function stage_name(s) {
    if (s == undefined) {
        return s
    }
    if (s.includes("WET")) {
        return "W:E:T Stage";
    } else if (s.includes("black")) {
        return "Black Stage";
    } else if (s.includes("true")) {
        return "True Metal Stage";
    } else if (s.includes("Party")) {
        return "Party Stage";
    } else if (s.includes("Headbangers")) {
        return "Headbangers Stage";
    } else if (s.includes("wackinger")) {
        return "Wackinger Stage";
    } else if (s.includes("Beer")) {
        return "Beer Garden";
    } else if (s.includes("church")) {
        return "Metal Church";
    } else if (s.includes("movie")) {
        return "Movie Field";
    } else if (s.includes("wasteland")) {
        return "Wasteland Stage";
    }
}

var result = "[";
$('.col-sm-38').each(function(){
    var stage = $(this).find('img').attr('src');
    if (stage == undefined){
        return true;
    }
    
    result += "{";
    result += "stage_name: " + quote(stage_name(stage)) + ",";

    result += "acts: [";
    
    var acts = $(this).find('.rosc_time');
    $(acts).each(function(){
        var entry = $(this).text();
        
        var regex = /(\d{2}:\d{2})\s-\s(\d{2}:\d{2})\s(.*)/g;
        var match = regex.exec(entry);
        if (match != null) {
            result += "{";
            result += "act: " + quote(match[3]) + ",";
            result += "start_time: " + quote(removeColon(match[1])) + ",";
            result += "end_time: " + quote(removeColon(match[2]));
            result += "},";
        }
    });
    
    if (result[result.length-1] == ',') {
        result = result.substring(0,result.length-1);
    }
      
    result += "]";
    
    result += "},";
    
});
result = result.substring(0,result.length-1);
result += "]";

console.log(result);