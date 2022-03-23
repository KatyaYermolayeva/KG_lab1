var h = 0;
var s = 0;
var v = 0;
var x = 0;
var y = 0;
var z = 0;
var l = 0;
var a = 0;
var b = 0;

var rr = 0;
var gg = 0;
var bb = 0;

var xw = 95.047;
var yw = 100.0;
var zw = 108.883;

var color = "#ffffff";

function f1(x) {
    var result = 0.0;
    if (x >= 0.008856) {
        result = Math.pow(x, 1.0 / 3.0);
    }
    else {
        result = x * 7.787 + 16.0 / 116.0;
    }
    return result;
}

function f2(x) {
    var result = 0.0;
    if (Math.pow(x, 3.0) >= 0.008856) {
        result = Math.pow(x, 3.0);
    }
    else {
        result = (x - 16.0 / 116.0) / 7.787;
    }
    return result;
}

function f3(x) {
    var result = 0.0;
    if (x >= 0.0031308) {
        result = Math.pow(x, 1.0 / 2.4) * 1.055 - 0.055;
    }
    else {
        result = 12.92 * x;
    }
    return result;
}

function f4(x) {
    var result = 0.0;
    if (x >= 0.04045) {
        result = Math.pow((x + 0.055) / 1.055, 2.4);
    }
    else {
        result = x / 12.92;
    }
    return result;
}

function toHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function xyz_to_lab() {
    window.l = 116 * f1(window.y / window.yw) - 16; 
    window.a = 500 * (f1(window.x / window.xw) - f1(window.y / window.yw));
    window.b = 200 * (f1(window.y / window.yw) - f1(window.z / window.zw));
}

function lab_to_xyz() {
    window.y = f2((window.l + 16.0) / 116.0) * window.yw;
    window.x = f2(window.a / 500.0 + (window.l + 16.0) / 116.0) * window.xw;
    window.z = f2((window.l + 16.0) / 116.0 - window.b / 200.0) * window.zw;
}

function xyz_to_rgb() {
    var xx = window.x / 100;
    var yy = window.y / 100;
    var zz = window.z / 100;
    var rn = 3.2406 * xx - 1.5372 * yy - 0.4986 * zz;
    var gn = -0.9689 * xx + 1.8758 * yy + 0.0415 * zz;
    var bn = 0.0557 * xx - 0.2040 * yy + 1.0570 * zz;
    window.rr = f3(rn);
    window.gg = f3(gn);
    window.bb = f3(bn);

    if (window.rr > 1 || window.bb > 1 || window.gg > 1 || window.rr < 0 || window.gg < 0 || window.bb < 0) {
        var warnings = document.getElementsByClassName("warning");
        for (i = 0; i < warnings.length; i++) {
            warnings[i].removeAttribute("hidden");
            window.rr += 1;
            window.gg += 1;
            window.bb += 1;
            window.rr %= 1;
            window.gg %= 1;
            window.bb %= 1;
        }
    }
    else {
        var warnings = document.getElementsByClassName("warning");
        for (i = 0; i < warnings.length; i++) {
            warnings[i].setAttribute("hidden", true);
        }
    }
}

function rgb_to_xyz() {
    var rn = f4(window.rr) * 100;
    var gn = f4(window.gg) * 100;
    var bn = f4(window.bb) * 100;

    window.x = 0.412453 * rn + 0.357580 * gn + 0.180423 * bn;
    window.y = 0.212671 * rn + 0.715160 * gn + 0.072169 * bn;
    window.z = 0.019334 * rn + 0.119193 * gn + 0.950227 * bn;
}

function hsv_to_rgb() {
    var c = (window.v * window. s) / 10000.0;
    var m = window.v / 100.0 - c;
    var xx = c * (1 - Math.abs((window.h / 60) % 2 - 1));

    var rn = 0;
    var gn = 0;
    var bn = 0;

    if (window.h < 60) {
        rn = c;
        gn = xx;
        bn = 0;
    }
    else if (window.h < 120) {
        rn = xx;
        gn = c;
        bn = 0;
    }
    else if (window.h < 180) {
        rn = 0;
        gn = c;
        bn = xx;
    }
    else if (window.h < 240) {
        rn = 0;
        gn = xx;
        bn = c;
    }
    else if (window.h < 300) {
        rn = xx;
        gn = 0;
        bn = c; 
    }
    else {
        rn = c;
        gn = 0;
        bn = xx;
    }

    window.rr = (rn + m);
    window.gg = (gn + m);
    window.bb = (bn + m);

    if (window.rr > 1 || window.bb > 1 || window.gg > 1 || window.rr < 0 || window.gg < 0 || window.bb < 0) {
        var warnings = document.getElementsByClassName("warning");
        for (i = 0; i < warnings.length; i++) {
            warnings[i].removeAttribute("hidden");
        }
        window.rr += 1;
        window.gg += 1;
        window.bb += 1;
        window.rr %= 1;
        window.gg %= 1;
        window.bb %= 1;
    }
    else {
        var warnings = document.getElementsByClassName("warning");
        for (i = 0; i < warnings.length; i++) {
            warnings[i].setAttribute("hidden", true);
        }
    }
}

function rgb_to_hsv() {
    var delta = Math.max(window.rr, window.gg, window.bb) - Math.min(window.rr, window.gg, window.bb);
    window.v = Math.max(window.rr, window.gg, window.bb) * 100;
    if (window.v == 0) {
        window.s = 0;
    }
    else {
        window.s = 10000 * delta / window.v;
    }

    if (delta == 0) {
        window.h = 0;
    }
    else if (window.v == 100 * window.rr) {
        window.h = 60 * (((window.gg - window.bb) / delta) % 6);
    }
    else if (window.v == 100 * window.gg) {
        window.h = 60 * ((window.bb - window.rr) / delta + 2);
    }
    else if (window.v == 100 * window.bb) {
        window.h = 60 * ((window.rr - window.gg) / delta + 4);
    }
    if (window.h < 0) {
        window.h += 360;
    }
}

function xyz_to_hsv() {
    xyz_to_rgb();

    window.color =  "#" + toHex(Math.round(window.rr * 255)) + toHex(Math.round(window.gg * 255)) + toHex(Math.round(window.bb * 255));

    rgb_to_hsv();
}

function hsv_to_xyz() {
    hsv_to_rgb();

    window.color =  "#" + toHex(Math.round(window.rr * 255)) + toHex(Math.round(window.gg * 255)) + toHex(Math.round(window.bb * 255));

    rgb_to_xyz();
}

function UpdateColors (element) {
    var ht = document.getElementById ("ht");
    var st = document.getElementById ("st");
    var vt = document.getElementById ("vt");
    var hs = document.getElementById ("hs");
    var ss = document.getElementById ("ss");
    var vs = document.getElementById ("vs");

    var xt = document.getElementById ("xt");
    var yt = document.getElementById ("yt");
    var zt = document.getElementById ("zt");
    var xs = document.getElementById ("xs");
    var ys = document.getElementById ("ys");
    var zs = document.getElementById ("zs");

    var lt = document.getElementById ("lt");
    var at = document.getElementById ("at");
    var bt = document.getElementById ("bt");
    var ls = document.getElementById ("ls");
    var as = document.getElementById ("as");
    var bs = document.getElementById ("bs");

    var display = document.getElementById("display");

    var id = element.id;
    var x = element.value;
    id = id.substring(0, 1);
    var el = document.getElementById(id + 's');
    el.value = x;
    var el = document.getElementById(id + 't');
    el.value = x;

    if ("hsv".includes(id)) {
        window.h = parseFloat(ht.value);
        window.s = parseFloat(st.value);
        window.v = parseFloat(vt.value);
        hsv_to_xyz();
        xyz_to_lab();
        display.value = window.color;
    }
    else if ("xyz".includes(id)) {
        window.x = parseFloat(xt.value);
        window.y = parseFloat(yt.value);
        window.z = parseFloat(zt.value);
        xyz_to_lab();
        xyz_to_hsv();
        display.value = window.color;
    }
    else if ("lab".includes(id)) {               
        window.l = parseFloat(lt.value);
        window.a = parseFloat(at.value);
        window.b = parseFloat(bt.value);
        lab_to_xyz();
        xyz_to_hsv();
        display.value = window.color;
    }
    else {
        var val = element.value;

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
        window.rr = parseInt(result[1], 16) / 255;
        window.gg = parseInt(result[2], 16) / 255;
        window.bb = parseInt(result[3], 16) / 255;

        rgb_to_hsv();
        hsv_to_xyz();
        xyz_to_lab();
    }

    ht.value = window.h;
    hs.value = window.h;
    st.value = window.s;
    ss.value = window.s;
    vt.value = window.v;
    vs.value = window.v;
    xt.value = window.x;
    xs.value = window.x;
    yt.value = window.y;
    ys.value = window.y;
    zt.value = window.z;
    zs.value = window.z;
    lt.value = window.l;
    ls.value = window.l;
    at.value = window.a;
    as.value = window.a;
    bt.value = window.b;
    bs.value = window.b;
}