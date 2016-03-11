/* 
Author : Sampad Kumar Saha

*/



var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
if (document.attachEvent) //if IE (and Opera depending on user setting)
    document.attachEvent("on"+mousewheelevt, displaywheel)
else if (document.addEventListener) //WC3 browsers
    document.addEventListener(mousewheelevt, displaywheel, false)

var docHeight = window.innerHeight;
var docWidth = window.innerWidth;
var cLayerHeight = parseInt(docHeight)- 80 + 'px';
canvasHeight = 600;
canvasWidth = 800;
var clCentreY = 300;
var clCentreX = 400;
var zoom = 1;
var graphValidity = true;

var gridVisible = true;
var cutsVisible = true;
var axesVisible = true;
var numbersVisible = true;

var mouseMoveArray = new Array();
mouseMoveArray[0]='0';
var mouseMoveArrayY = new Array();
mouseMoveArrayY[0]='0';

var leftNew = 400;
var topNew = 300;

var shouldI = true;

var numX = parseInt(canvasWidth/xInterpol);
var numY = parseInt(canvasHeight/yInterpol);
var lnumX = parseInt(numX/2);
var rnumX = parseInt(numX/2)+1;
var tnumY = parseInt(numY/2);
var bnumY = parseInt(numY/2)+1;


function trigger(){
    setDimensions();
    plotGraph(1);
    document.getElementById('functioninputva').focus();
    
    canvasva.ondragover = function(e) {
        e.preventDefault();        
        return false;
    };

}
function setDimensions(){
    document.getElementById('centrallayer').style.height = cLayerHeight;
}
function displaywheel(e){
    var evt=window.event || e //equalize event object
    var delta=evt.detail? evt.detail : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta
    if(delta == 120){
        if((zoom+0.05) < 5)
            zoom = zoom + 0.07;
        plotGraph(zoom);
    }else{
        if((zoom-0.05) > 0.1)
            zoom = zoom - 0.05;
        plotGraph(zoom);
    }
}
function inputDone(){
    if(window.event.keyCode == 13){
        plotGraph(1);
    }
}
function plotGraph(zoom){
    //clean the canvas area
    ctx.clearRect ( 0 , 0 , canvasWidth , canvasHeight );
    ctxAxes.clearRect ( 0 , 0 , canvasWidth , canvasHeight );
    ctxCuts.clearRect ( 0 , 0 , canvasWidth , canvasHeight );
    ctxNumbers.clearRect ( 0 , 0 , canvasWidth , canvasHeight );
    ctxGrid.clearRect ( 0 , 0 , canvasWidth , canvasHeight );

    graphValidity = true;
    var xInterpol = parseInt(40*zoom);
    var yInterpol = parseInt(40*zoom);
    var numX = parseInt(canvasWidth/xInterpol);
    var numY = parseInt(canvasHeight/yInterpol);

    var lnumX = parseInt(leftNew/xInterpol);
    var rnumX = numX - parseInt(leftNew/xInterpol);
    var tnumY = parseInt(topNew/yInterpol);
    var bnumY = numY - parseInt(topNew/yInterpol);
    
    ctxNumbers.fillStyle = "blue";
    ctxNumbers.font = "bold 18px Arial";
    ctxNumbers.fillText(document.getElementById('functioninputva').value, 100, 40);    
    ctxNumbers.fillStyle = "green";
    ctxNumbers.font = "bold 13px Arial";
    
    plotAxes(leftNew);
    plotCuts(xInterpol, yInterpol, lnumX, rnumX, tnumY, bnumY, leftNew);
    plotNumbers(xInterpol, yInterpol, lnumX, rnumX, tnumY, bnumY, leftNew);
    plotGrid(xInterpol, yInterpol, lnumX, rnumX, tnumY, bnumY);
    //document.getElementById('bottomlayer').innerHTML = document.getElementById('bottomlayer').innerHTML + shouldI;//
    if(shouldI == true) plotCurve(xInterpol, yInterpol, leftNew);
    
}
function plotAxes(leftNewa){
    //draw the x axis
    ctxAxes.beginPath();
    ctxAxes.moveTo(0, topNew);
    ctxAxes.lineTo(800,topNew);
    ctxAxes.stroke();


    //draw the y axis
    ctxAxes.beginPath();
    ctxAxes.moveTo(leftNew, 0);
    ctxAxes.lineTo(leftNew,600);
    ctxAxes.stroke();
}
function plotCurve(xInterpol, yInterpol){
    var apnaExpression = document.getElementById('functioninputva').value;
    var xPosa = 0;
    for( var x=leftNew; x<=800; x = x+2){
        if(graphValidity == true){
            xPosa = x;
            var toEvaluate1 = apnaExpression.replace(/x/g, ((xPosa-leftNew)/yInterpol).toString());
            var toEvaluate2 = apnaExpression.replace(/x/g, ((xPosa+2-leftNew)/yInterpol).toString());
            yPosa1 = topNew - yInterpol*mathEval(toEvaluate1.toString());
            yPosa2 = topNew - yInterpol*mathEval(toEvaluate2.toString());
            if(yPosa1*yPosa2 > 0){
                ctx.beginPath();
                ctx.moveTo(xPosa,yPosa1);
                ctx.lineTo(xPosa+1,yPosa2);
                ctx.stroke();
            }
        }
    }
    for( var x=leftNew; x>=0; x=x-2){
        if(graphValidity == true){
            xPosa = x;
            var toEvaluate1 = apnaExpression.replace(/x/g, ((xPosa-leftNew)/yInterpol).toString());
            var toEvaluate2 = apnaExpression.replace(/x/g, ((xPosa+2-leftNew)/yInterpol).toString());
            yPosa1 = topNew - yInterpol*mathEval(toEvaluate1.toString());
            yPosa2 = topNew - yInterpol*mathEval(toEvaluate2.toString());
            if(yPosa1*yPosa2 > 0){
                ctx.beginPath();
                ctx.moveTo(xPosa,yPosa1);
                ctx.lineTo(xPosa+1,yPosa2);
                ctx.stroke();
            }
        }
    }
}
function plotNumbers(xInterpol, yInterpol, lnumX, rnumX, tnumY, bnumY){
    for( var d=1; d<=rnumX; d++){
        xPos = leftNew + xInterpol*d;
        yPos = topNew + yInterpol;
        ctxNumbers.fillText(d, xPos, yPos);
    }
    for( var d=1; d<=lnumX; d++){
        xPos = leftNew - xInterpol*d;        
        yPos = topNew + yInterpol;
        ctxNumbers.fillText(-1*d, xPos, yPos);
    }
    for( var d=1; d<=tnumY; d++){
        yPos = topNew - xInterpol*d;
        xPos = leftNew - xInterpol;                
        ctxNumbers.fillText(d, xPos, yPos);        
    }
    for( var d=2; d<=bnumY; d++){
        yPos = topNew + xInterpol*d;
        xPos = leftNew - xInterpol;                
        ctxNumbers.fillText(-1*d, xPos, yPos);    
    }
}
function plotCuts(xInterpol, yInterpol, lnumX, rnumX, tnumY, bnumY){
    for( var d=1; d<=rnumX; d++){
        xPos = leftNew + xInterpol*d;
        ctxCuts.beginPath();
        ctxCuts.moveTo(xPos, topNew-yInterpol/4);
        ctxCuts.lineTo(xPos,topNew+yInterpol/4);
        ctxCuts.stroke();
    }
    for( var d=1; d<=lnumX; d++){
        xPos = leftNew - xInterpol*d;
        ctxCuts.beginPath();
        ctxCuts.moveTo(xPos, topNew-yInterpol/4);
        ctxCuts.lineTo(xPos,topNew+yInterpol/4);
        ctxCuts.stroke();
    }
    for( var d=1; d<=tnumY; d++){
        yPos = topNew - xInterpol*d;
        ctxCuts.beginPath();
        ctxCuts.moveTo(leftNew-yInterpol/4, yPos);
        ctxCuts.lineTo(leftNew+yInterpol/4, yPos);
        ctxCuts.stroke();
    }
    for( var d=1; d<=bnumY; d++){
        yPos = topNew + xInterpol*d;
        ctxCuts.beginPath();
        ctxCuts.moveTo(leftNew-yInterpol/4, yPos);
        ctxCuts.lineTo(leftNew+yInterpol/4, yPos);
        ctxCuts.stroke();
    }
}
function plotGrid(xInterpol, yInterpol, lnumX, rnumX, tnumY, bnumY){
    for( var d=1; d<=rnumX; d++){
        xPos = leftNew + xInterpol*d;
        ctxGrid.beginPath();
        ctxGrid.moveTo(xPos, 0);
        ctxGrid.lineTo(xPos,600);
        ctxGrid.stroke();
    }
    for( var d=1; d<=lnumX; d++){
        xPos = leftNew - xInterpol*d;
        ctxGrid.beginPath();
        ctxGrid.moveTo(xPos, 0);
        ctxGrid.lineTo(xPos,600);
        ctxGrid.stroke();
    }
    for( var d=1; d<=tnumY; d++){
        yPos = topNew - xInterpol*d;
        ctxGrid.beginPath();
        ctxGrid.moveTo(0, yPos);
        ctxGrid.lineTo(1000, yPos);
        ctxGrid.stroke();
    }
    for( var d=1; d<=bnumY; d++){
        yPos = topNew + xInterpol*d;
        ctxGrid.beginPath();
        ctxGrid.moveTo(0, yPos);
        ctxGrid.lineTo(1000, yPos);
        ctxGrid.stroke();
    }
}
function mathEval (exp) {
    var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
    valid = true;
    exp = exp.replace(reg, function ($0) {
        if (Math.hasOwnProperty($0))
            return "Math."+$0;
        else
            valid = false;
    });
    if (!valid)
        graphValidity = false;
    else
        try {
            return eval(exp);
        } catch (e) {
            return '';
        };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showHideGrid(){
    alert(document.getElementById('canvasvaAxes').style.visibility);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function graphMove(){    
    var mousePosva = parseInt(parseInt(window.event.clientX)-parseInt(document.getElementById('container').offsetLeft)-200);
    var mousePosvaY = parseInt(parseInt(window.event.clientY)-parseInt(document.getElementById('container').offsetTop)-50);
    if(mousePosva > 0 && mousePosvaY > 0){        
        shouldI = false;
    }
    //document.getElementById('bottomlayer').innerHTML = document.getElementById('bottomlayer').innerHTML + ', ' + mousePosvaY;
    if(mousePosva > 0){
        mouseMoveArray.push(mousePosva);
        if(mouseMoveArray[mouseMoveArray.length-1] > mouseMoveArray[mouseMoveArray.length-2]){
            leftNew = leftNew + 5;
            plotGraph(zoom);
        } else if(mouseMoveArray[mouseMoveArray.length-1] < mouseMoveArray[mouseMoveArray.length-2]){
            leftNew = leftNew - 5;
            plotGraph(zoom);
        }
    } else{

    }
    if(mousePosvaY > 0){
        mouseMoveArrayY.push(mousePosvaY);
        if(mouseMoveArrayY[mouseMoveArrayY.length-1] > mouseMoveArrayY[mouseMoveArrayY.length-2]){
            topNew = topNew + 5;
            plotGraph(zoom);
        } else if(mouseMoveArrayY[mouseMoveArrayY.length-1] < mouseMoveArrayY[mouseMoveArrayY.length-2]){
            topNew = topNew - 5;
            plotGraph(zoom);
        }
    }
    

}
function helpClicked(){
    if(parseInt(document.getElementById('helpdabba').offsetLeft) == 800) document.getElementById('helpdabba').style.left = '0px';
    else document.getElementById('helpdabba').style.left = '800px';
    if(document.getElementById('helpbutton').innerHTML == 'Show Help') document.getElementById('helpbutton').innerHTML = 'Hide Help';
    else document.getElementById('helpbutton').innerHTML = 'Show Help';
}
function showHideGrid(){
    if(gridVisible == true){
        document.getElementById('canvasvaGrid').style.visibility = 'hidden';
        document.getElementById('tickIGrid').style.visibility = 'hidden';
        gridVisible = false;
    } else if (gridVisible == false){
        document.getElementById('canvasvaGrid').style.visibility = 'visible';
        document.getElementById('tickIGrid').style.visibility = 'visible';
        gridVisible = true;
    }
}
function showHideCuts(){
    if(cutsVisible == true){
        document.getElementById('canvasvaCuts').style.visibility = 'hidden';
        document.getElementById('tickICuts').style.visibility = 'hidden';
        cutsVisible = false;
    } else if (cutsVisible == false){
        document.getElementById('canvasvaCuts').style.visibility = 'visible';
        document.getElementById('tickICuts').style.visibility = 'visible';
        cutsVisible = true;
    }
}
function showHideAxes(){
    if(axesVisible == true){
        document.getElementById('canvasvaAxes').style.visibility = 'hidden';
        document.getElementById('tickIAxes').style.visibility = 'hidden';
        axesVisible = false;
    } else if (axesVisible == false){
        document.getElementById('canvasvaAxes').style.visibility = 'visible';
        document.getElementById('tickIAxes').style.visibility = 'visible';
        axesVisible = true;
    }
}
function showHideNumbers(){
    if(numbersVisible == true){
        document.getElementById('canvasvaNumbers').style.visibility = 'hidden';
        document.getElementById('tickINumbers').style.visibility = 'hidden';
        numbersVisible = false;
    } else if (numbersVisible == false){
        document.getElementById('canvasvaNumbers').style.visibility = 'visible';
        document.getElementById('tickINumbers').style.visibility = 'visible';
        numbersVisible = true;
    }
}