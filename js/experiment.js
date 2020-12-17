

function showItems(showItemsList){
    var mouseItems = ['choiceTL', 'choiceTR','choiceBR','choiceBL'],
    i = 0;

    //If mouse hovers over one of the choiceItems, show info.
    for (i = 0; i<mouseItems.length; i++) {

        //Mouse over target, show item
        if (event.target.className == mouseItems[i]){
            
            //Never show more than 1 item at a time            
            if (squareTL.childNodes.length > (mouseItems.length) ){
                squareTL.removeChild(squareTL.childNodes[4])
            }
            
            //show info
            squareTL.appendChild(showItemsList[i]);

        } 
    }
    // remove all childnodes when cursur not on choice items
    if ((event.target.className == 'choiceGridContainer') & 
        (squareTL.childNodes.length > 4)) {

        while (squareTL.childNodes.length > 4){
            squareTL.removeChild(squareTL.childNodes[squareTL.childNodes.length-1])
        }
        
    }
}

 
confirmChoice = function(confirmWaitTime){
    var confirm = 0;

    if (event.target.className == "choiceTL" | event.target.className == "choiceBL" |
        event.target.className == "itemTL" | event.target.className == "itemBL"){
        choiceTL.style.borderTop="1vh solid coral";
        choiceTL.style.borderLeft="1vh solid coral";
        choiceTL.style.borderRight="1vh solid coral";
        choiceBL.style.borderBottom="1vh solid coral";
        choiceBL.style.borderLeft= "1vh solid coral";
        choiceBL.style.borderRight= "1vh solid coral";

        confirm = 1;

    } else if (event.target.className == "choiceTR" | event.target.className == "choiceBR" |
        event.target.className == "itemTR" | event.target.className == "itemBR") {
        choiceTR.style.borderTop="1vh solid coral";
        choiceTR.style.borderLeft="1vh solid coral";
        choiceTR.style.borderRight="1vh solid coral";
        choiceBR.style.borderBottom="1vh solid coral";
        choiceBR.style.borderLeft= "1vh solid coral";
        choiceBR.style.borderRight= "1vh solid coral";

        confirm = 1;
    } else {
        confirm = 0;
    }

    // remove all after confirming
    if (confirm == 1){
        setTimeout(function(){
            squareTL.remove();
        }, confirmWaitTime);
        
    }
}


//decisionTaskTrialMaker
function decisionTaskTrialMaker(baseoffer, loadFunc, nameLoadFunc, nTrials, phase){
    
    var trials = [], i = 0, j = 0,k = 0,l = 0,m = 0, n=0,
    trialInfoTemp = [], count = 0,condComp2 = 0, condComp = 0,
    allTrialTypes = [],allTrialTypesShuf = [],
    cTrialsTemp = [], countTrials = repeat(0,(baseoffer.length * 5)),
    upComp = [30,50], downComp = [-20,-30], nTrialsCB = 7, nTrialsCatch = 1,
    cbTrialTypes = [],cbTrialsTemp = [], adjIndif = 0, nDecisionCBTrials = [];
    
    for (n=0;n<2;n++){
        compareBaseNameLoad = nameLoadFunc[n];
        compareBaseLoad = loadFunc[n];
        newNameLoad = nameLoadFunc.slice(n+1,nameLoadFunc.length);
        newLoad = loadFunc.slice(n+1,loadFunc.length);
        
        cbTrialTypes = [].concat(repeat(0,nTrialsCB),repeat(1,nTrialsCatch));
        
        //Make all trial types
        for (i = 0; i < baseoffer.length; i++){
            for (j = 0;j < newNameLoad.length; j++){
                condComp = ((i*newNameLoad.length)+j);
                condComp2 = (n*3*baseoffer.length) +condComp;

                adjIndif = 0;
                //calibration trials
                for (k = 0;k < nTrials; k++){
                    cTrialsTemp.push([condComp2, newNameLoad[j],compareBaseNameLoad, newLoad[j], compareBaseLoad, baseoffer[i], adjIndif, 'C']);
                }
                
                //if not practice
                if (phase != 'P'){
                    // cost benefit trials
                    for (l = 0; l<2; l++){
                        for(m = 0; m< cbTrialTypes.length; m++){
                            
                            //Normal trial up
                            if (l === 0 && cbTrialTypes[m] === 0){
                                adjIndif = ((Math.random()*(upComp[1]-upComp[0])) + upComp[0])/100;
                            //Normal trial down    
                            }else if (l == 1 && cbTrialTypes[m] === 0) {
                                adjIndif = ((Math.random()*(downComp[1]-downComp[0])) + downComp[0])/100;
                            //catch trial type 1
                            } else if (l == 1 && cbTrialTypes[m] == 1){
                                adjIndif = -1;
                            //catch trial type 2    
                            } else {
                                adjIndif = 1;
                            }
                            
                            cbTrialsTemp.push([condComp2, newNameLoad[j],compareBaseNameLoad, newLoad[j], compareBaseLoad, baseoffer[i],adjIndif, 'CB']);
                        }
                    }
                } 
            }
        }    
    }
    
    //Shuffle order calibration trials
    nDecisionBlockTrials = range(cTrialsTemp.length);
    shuffle(nDecisionBlockTrials);
    
    //Shuffle order cost benefit trials
    nDecisionCBTrials = range(cbTrialsTemp.length);
    shuffle(nDecisionCBTrials);
    
    allTrialTypesShuf.push(nDecisionBlockTrials, nDecisionCBTrials);
    allTrialTypes.push(cTrialsTemp, cbTrialsTemp);
    
    for (i = 0; i < allTrialTypes.length; i++){
        tempTrials = allTrialTypes[i];
        tempTrialsOrder = allTrialTypesShuf[i];
        for (j = 0; j < tempTrialsOrder.length; j++){
            //Count conditions
            trialInfoTemp = tempTrials[tempTrialsOrder[j]];
            tempCond = trialInfoTemp[0];
            tempNameLL = trialInfoTemp[1];
            tempNameSS = trialInfoTemp[2];
            tempLL = trialInfoTemp[3];
            tempSS = trialInfoTemp[4];
            tempOffer = trialInfoTemp[5];
            tempProx = trialInfoTemp[6];
            tempType = trialInfoTemp[7];
            trialCondNrCount = countTrials[tempCond];
            
            countTrials[tempCond]++;
            /*Column names
            0) trial number, 1) Condition trial number, 2) condition number
            3) high name load, 4) low name load, 5) high load, 6) low load,
            7) high offer, 8) adjustment 9) proximity indif 10) phase
            */
            if (tempType == 'CB'){
                tempAdj = 0;
            } else {
                tempAdj = (tempOffer* (1/Math.pow(2,(trialCondNrCount+2))));
            }
            trials.push([j, trialCondNrCount, tempCond, tempNameLL,tempNameSS,
            tempLL,tempSS,tempOffer,tempAdj,tempProx,tempType]);

        }
    }
    
    return(trials);
}



var clickX, clickY;
var confirmWaitTime = 500;


var squareTL = document.createElement("div"),
itemTL = document.createElement("div"),itemTR = document.createElement("div"),
itemBL = document.createElement("div"),itemBR = document.createElement("div"),
choiceTL = document.createElement("div"), choiceTR = document.createElement("div"),
choiceBL = document.createElement("div"), choiceBR = document.createElement("div");

//Set grid
squareTL.setAttribute("class", "choiceGridContainer");

//Create square border around text
choiceBL.setAttribute("class", "choiceBL");
choiceBR.setAttribute("class", "choiceBR");
choiceTL.setAttribute("class", "choiceTL");
choiceTR.setAttribute("class", "choiceTR");

squareTL.appendChild(choiceTL);
squareTL.appendChild(choiceTR);
squareTL.appendChild(choiceBL);
squareTL.appendChild(choiceBR);

//Create text. Somehow it is not possible to do in choice items. Messes up text allignment.
itemTL.setAttribute("class", "itemTL");
itemTR.setAttribute("class", "itemTR");
itemBL.setAttribute("class", "itemBL");
itemBR.setAttribute("class", "itemBR");

var showItemsList = [];

//document.getElementById('choiceTL').addEventListener("mousemove", printMousePos);
var i = 0;


//-------------------- Experiment ----------------//


var letter1 = 'A',letter2 = 'B',money1 = 1, money2 = 2,
//make trials decision practice
load = [1,2,3,4], nameLoad =  ['a','e','i','o'], baseofferP = [1,3], nTrialsDecisionP = 1,
trielInfoTemp = [];


decisionTrialsP = decisionTaskTrialMaker(baseofferP, load, nameLoad, nTrialsDecisionP, 'P');
/*
0) trial number, 1) Condition trial number, 2) condition number
3) high name load, 4) low name load, 5) high load, 6) low load,
7) high offer, 8) adjustment 9) proximity indif 10) phase
*/

for (i = 0; i<10; i++){
    trielInfoTemp = decisionTrialsP[i];
    itemTL.innerHTML = 'Task: '  + letter1;
    itemTR.innerHTML = 'Task: '  + letter2;
    itemBL.innerHTML = '$'  + money1.toFixed(2);
    itemBR.innerHTML = '$'  + money2.toFixed(2);

    showItemsList = [itemTL,itemTR,itemBR,itemBL];

    document.body.appendChild(squareTL);
    document.body.addEventListener("mousemove", function() {showItems(showItemsList)});
    document.body.addEventListener("click", function() {confirmChoice(confirmWaitTime)});



}



//-------------------- Extra functions ----------------//

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

//shuffle array 
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

//repeat item in array
function repeat(item, times) {
    var rslt = [];
    for(i = 0; i < times; i++) {
    rslt.push(item);
  }
  return rslt;
}

function range() {
    var results = [];

    // Allow comparison to be variable
    var lessThan = function (a, b) {return (a < b); };
    var greaterThan = function (a, b) {return (a > b); };

    if (arguments.length === 1) {
        var start = 0;
        var stop = arguments[0];
        var step = 1;
        var comparisonTest = lessThan;
    } else {
        var start = arguments[0];
        var stop = arguments[1];
        var step = arguments[2] || 1;
        var comparisonTest = ((step > 0)? lessThan : greaterThan);
    };

    for (var i = start; comparisonTest(i, stop) ; i += step) {
        results.push(i);
    };

    return results;
};
/*
document.body.addEventListener("mousemove", function(){


    if (event.target.className == "choiceTL") {
        squareTL.appendChild(itemTL);
    } else if (event.target.className == "choiceTR") {
        squareTL.appendChild(itemTR);
    } else if (event.target.className == "choiceBR") {
        squareTL.appendChild(itemBR);
    } else if (event.target.className == "choiceBL") {
        squareTL.appendChild(itemBL);
    } else {
        squareTL.parentNode.removeChild(squareTL);
    }
  });

setTimeout(function(){
    document.body.appendChild(squareTL);
}, startExp += 1000);

setTimeout(function(){
    squareTL.parentNode.removeChild(squareTL);
},startExp += 1000);


setTimeout(function(){
    squareTL.appendChild(itemTL);
    squareTL.appendChild(itemTR);
    squareTL.appendChild(itemBR);
    squareTL.appendChild(itemBL);
    document.body.appendChild(squareTL);
}, startExp += 1000);

setTimeout(function(){
    squareTL.parentNode.removeChild(squareTL);
},startExp += 1000);


setTimeout(function(){
    itemTL.parentNode.removeChild(itemTL);
    itemBL.parentNode.removeChild(itemBL);
},startExp += 1000);
*/

/*


//---------------------
function await(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
  return(1)
}
console.log(new Date().getTime());
await(1000);
console.log(new Date().getTime());




var screenX = window.innerWidth, screenY = window.innerHeight;



//setTimeout(() => {  ctx.stroke(); }, 2000);


const vowels = ''

console.log(screenY)


/*

var hello_trial = {
type: 'html-keyboard-response',
stimulus: screenX + ' ' + screenY
}

var trial = {
    type: 'html-button-response',
    stimulus: '<p>Which do you prefer?</p>',
    choices: ['Task ' + 'A' + '<br>$' + 1, 'Task ' +'B'+ ' <br>$' + 2],
    prompt: ""
}

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 1000,
}

var instructions = {
type: "html-keyboard-response",
stimulus: "<p>In this experiment, a circle will appear in the center " +
    "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
    "press the letter F on the keyboard as fast as you can.</p>" +
    "<p>If the circle is <strong>orange</strong>, press the letter J " +
    "as fast as you can.</p>" +
    "<div style='width: 700px;'>"+
    "<div style='float: left;'><img src='img/blue.png'></img>" +
    "<p class='small'><strong>Press the F key</strong></p></div>" +
    "<div class='float: right;'><img src='img/orange.png'></img>" +
    "<p class='small'><strong>Press the J key</strong></p></div>" +
    "</div>"+
    "<p>Press any key to begin.</p>"
}


jsPsych.init({
    timeline: [fixation, trial]
})
*/
