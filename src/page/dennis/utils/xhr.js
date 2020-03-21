export function get(url, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                return success(xhr.responseText);
            }
            if (error) {
                return error(xhr.status + ' ' + xhr.statusText);
            }
            throw xhr.status + ' ' + xhr.statusText;
        }
    };
    xhr.open('GET', url, true);
    xhr.send(null);
}

export function getBuffer(url, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                return success(e.currentTarget.response);
            }
            if (error) {
                return error(xhr.status + ' ' + xhr.statusText);
            }
            throw xhr.status + ' ' + xhr.statusText;
        }
    };
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.send(null);
}
