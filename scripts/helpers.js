const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

function strMapToObj(strMap) {
	let obj = Object.create(null);
	for (let [k,v] of strMap) {
		// We don’t escape the key '__proto__'
		// which can cause problems on older engines
		obj[k] = v;
	}
	return obj;
}

function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
