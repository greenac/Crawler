var scaler = parseInt(process.argv[2]);
var BASE_LOOPS = 1000000;
var total = 0;

var loopScaler = Math.floor(Math.random()*100);
var numOfLoops = Math.floor(scaler*BASE_LOOPS/loopScaler);
for (var i=0; i < numOfLoops; i++) {
    total = i;
}

console.log('finished running', numOfLoops, 'number of loops for', process.argv[3]);