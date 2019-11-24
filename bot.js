function square(a,b){ //returns the element at a coordinate
	return document.getElementById(a+"_"+b);
}
function osR(a,b){ //tests if block is outside the playing feild
	if(a<=0||b<=0||a>16||b>30) return true;
}
function numB(a,b){ //number of bombs around an uncovered square
	return parseInt(square(a,b).classList[1].substring(4));
}
function leftClick(el){ //simulates a left click
    el.dispatchEvent(new MouseEvent('mouseup', { 'bubbles': true}));
}
function rightClick(el){ //simulates a right click
	el.dispatchEvent(new MouseEvent('mousedown', { 'bubbles': true, "button":2}));
    el.dispatchEvent(new MouseEvent('mouseup', { 'bubbles': true, "button":2}));
}

function loopAround(a,b,f,g){ //loops around an uncovered square, looking for blank or flagged squares
	for(let c=-1;c<2;c++) for(let d=-1;d<2;d++){
    	if(osR(a+c,b+d)) continue;
        let el = square(a+c,b+d);
        if(el.classList[1]=="blank") f(el);
        if(g&&el.classList[1]=="bombflagged") g(el);
    }
}

function autoLevel1(a,b){
	let count1 = 0;
    let count2 = 0;
    let BB = numB(a,b); if(isNaN(BB)||BB===0) return false;
    loopAround(a,b,()=>{count1++;},()=>{count2++;});
    if(count1===0) return false;
	if(count2===BB){
    	//uncover all blank squares
        loopAround(a,b,leftClick);
        return true;
    }
    if(count1+count2===BB){
		//flag all blank squares
    	loopAround(a,b,rightClick);
        return true;
    }
    return false;
}
function autoLevel2(a,b,dirH){
	let countA = numB(a,b);
    let countB = numB(a+1-dirH,b+dirH);
    let cA = [];
    let cM = [];
    let cB = [];
    if(isNaN(countA)||isNaN(countB)) return false;
    
    for(let c= -1;c<=2-dirH;c++) for(let d= -1;d<=1+dirH;d++){
    	if(osR(a+c,b+d)) continue;
        let el = square(a+c,b+d);
        let v = dirH===0?c:d;
        if(el.classList[1]=="blank"){
        	if(v=== -1) cA.push(el);
            else if(v===2) cB.push(el);
            else cM.push(el);
        }
        if(el.classList[1]=="bombflagged"){
        	if(v<2) countA--;
            if(v>-1) countB--;
        }
    }
    
		if(countA===0||countB===0) return false;
    //either nothing to be done, or needs autoflag
    
    let poss = [false,false,false,false,false,false,false,false,false];
    for(let x=0;x<=cA.length;x++) for(let y=0;y<=cM.length;y++) for(let z=0;z<=cB.length;z++){
    	if(x+y===countA && y+z===countB){
        	if(x===0) 				poss[0] = true;
            else if(x===cA.length)  poss[1] = true;
            else 					poss[2] = true;
            if(y===0) 				poss[3] = true;
            else if(y===cM.length)  poss[4] = true;
            else 					poss[5] = true;
            if(z===0) 				poss[6] = true;
            else if(z===cB.length)  poss[7] = true;
            else 					poss[8] = true;
        }
    }
    
    let result = false;
    if(cA.length>0 && poss[0] && !poss[1] && !poss[2]){result = true; cA.forEach(leftClick);}
    if(cA.length>0 && !poss[0] && poss[1] && !poss[2]){result = true; cA.forEach(rightClick);}
    if(cM.length>0 && poss[3] && !poss[4] && !poss[5]){result = true; cM.forEach(leftClick);}
    if(cM.length>0 && !poss[3] && poss[4] && !poss[5]){result = true; cM.forEach(rightClick);}
    if(cB.length>0 && poss[6] && !poss[7] && !poss[8]){result = true; cB.forEach(leftClick);}
    if(cB.length>0 && !poss[6] && poss[7] && !poss[8]){result = true; cB.forEach(rightClick);}
    return result;
}

function autoauto(a1,b1,level2,run, run2){
	setTimeout(function(){loop(a1,b1,level2,run,run2);}, 20);
    //loop(a1,b1,level2,run,run2);
}

function loop(a1,b1,level2,run,run2){
	if(!level2){
		for(let a=a1;a<=16;a++){ for(let b=1;b<=30;b++){
        	if(autoLevel1(a,b)){ autoauto(a,b,false,true,true); return;}
    	}}
        if(run) autoauto(1,1,false,false,run2); 
        else autoauto(1,1,true,false,run2); 
    }else{
        for(let a=a1;a<=16;a++) for(let b=1;b<=30;b++){
            if(autoLevel2(a,b,0)||autoLevel2(a,b,1)){ autoauto(a,b,true,true,true); return;}
        }
        if(run) autoauto(1,1,true,false,run2);
        else if(run2) autoauto(1,1,false,false,false);
    }
}

document.addEventListener("keydown",function(e){ if(e.keyCode==67) autoauto(1,1,false,false,false);});
