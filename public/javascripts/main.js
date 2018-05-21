// d=data, t=target, s=start, e=end, m=middle

var arr = [1, 2, 5, 7, 29];
var target = 3;

function binarySearch(d, t, s, e){
  var m = Math.floor((s + e)/2);
  if(t == d[m]){
   return d[m];
  }
  if(e - 1 == s){
  	if(Math.abs(d[s] - t) > Math.abs(d[e] - t)){
  		return d[e]
  	} else{
  		return d[s];
  	}
  } 
  // if(t > d[m]){ 
  // 	return binarySearch(d,t,m,e);
  // }
  if(t < d[m]){
   return binarySearch(d,t,s,m);
  }
}

var closestPoint = binarySearch(arr, target, 0, arr.length-1)

console.log(closestPoint);