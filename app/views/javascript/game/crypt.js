//=============================================================================
// crypt.js
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Jan 10 15:20:07 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

// This one was one hell of a headache :P
// I have to play with C++ from time to time

var Base64Str = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function Utf8Encode(input) {
    input = input.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < input.length; n++) {
        var c = input.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext;
}

function Utf8Decode(input) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < input.length ) {
        c = input.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = input.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = input.charCodeAt(i+1);
            c3 = input.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return string;
}

function Base64Encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    
    input = Utf8Encode(input);
    
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        Base64Str.charAt(enc1) + Base64Str.charAt(enc2) +
        Base64Str.charAt(enc3) + Base64Str.charAt(enc4);
    }

    return output;
}

function Base64Decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
        enc1 = Base64Str.indexOf(input.charAt(i++));
        enc2 = Base64Str.indexOf(input.charAt(i++));
        enc3 = Base64Str.indexOf(input.charAt(i++));
        enc4 = Base64Str.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }

    output = Utf8Decode(output);

    return output;

}

function Crypt(input, keyStr) {
    if (!keyStr) return '';

    var output = '';
    for(var i = 0; i < input.length; ++i) {
        output += String.fromCharCode(
            ((input.charCodeAt(i) & 255)
            ^ (keyStr.charCodeAt(i % keyStr.length) & 255)) & 255
        );
    }
    
    return output;
}

// Support only goes only to 32bits, any further than that is dead
//   Supposing that a javascript var is actually 32bit
function IntToStr(nbr, bytes) {
    nbr = (nbr+.5)|0; // Make sure it's integer by rounding it
    if (isNaN(bytes)) bytes = 4; // Int is 4bytes long

    var str = '';

    for (var i = 0; i < bytes; ++i) {
        str += String.fromCharCode((nbr >> i*8) & 255);
    }

    return str;
}

function StrToInt(str) {
    var value = 0;

    for(var i = 0; i < str.length; ++i) {
        value += (str.charCodeAt(i) & 255) << i * 8;
    }

    return value;
}

// Transforms an array of int values into
function Serialize(intArray, keyStr) {
    var result = '';
    
    for (var i = 0; i < intArray.length; ++i) {
        var str = IntToStr(intArray[i]);
        for (var j = 0; j < 4; ++j) {
            result += str.charAt(j);
        }
    }

    return crypt(result, keyStr);
}
