class Calculator{
constructor(prevEl,currEl){
this.prevEl=prevEl;
this.currEl=currEl;
this.historyEl=document.getElementById('history-list');
this.history=JSON.parse(localStorage.getItem('calcHistory'))||[];
this.clear();
this.renderHistory();
}

clear(){
this.current='0';
this.previous='';
this.operation=undefined;
this.update();
}

delete(){
if(this.current==='0')return;
this.current=this.current.slice(0,-1)||'0';
this.update();
}

appendNumber(n){
if(n==='.' && this.current.includes('.'))return;
this.current=(this.current==='0' && n!=='.')?n:this.current+n;
this.update();
}

chooseOperation(op){
if(this.previous!=='')this.compute();
this.operation=op;
this.previous=this.current;
this.current='0';
this.update();
}

compute(){
const prev=parseFloat(this.previous);
const curr=parseFloat(this.current);
if(isNaN(prev)||isNaN(curr))return;

let result;
switch(this.operation){
case '+':result=prev+curr;break;
case '-':result=prev-curr;break;
case '*':result=prev*curr;break;
case '/':
if(curr===0){alert("Cannot divide by zero");this.clear();return;}
result=prev/curr;break;
default:return;
}

const eq=`${prev} ${this.operation} ${curr} = ${result}`;
this.saveHistory(eq);

this.current=result.toString();
this.operation=undefined;
this.previous='';
this.update();
}

update(){
this.currEl.innerText=this.current;
this.prevEl.innerText=this.operation?`${this.previous} ${this.operation}`:'';
}

/* History */
saveHistory(eq){
this.history.unshift(eq);
if(this.history.length>20)this.history.pop();
localStorage.setItem('calcHistory',JSON.stringify(this.history));
this.renderHistory();
}

renderHistory(){
this.historyEl.innerHTML='';
if(!this.history.length){
this.historyEl.innerHTML='<div style="opacity:.5;text-align:center;margin-top:20px">No history</div>';
return;
}
this.history.forEach(item=>{
const div=document.createElement('div');
div.className='history-item';
div.innerText=item;
div.onclick=()=>{
this.current=item.split(' = ')[1];
this.update();
};
this.historyEl.appendChild(div);
});
}

clearHistory(){
this.history=[];
localStorage.removeItem('calcHistory');
this.renderHistory();
}
}

const calculator=new Calculator(
document.getElementById('previous-operand'),
document.getElementById('current-operand')
);

function toggleHistory(){
document.getElementById('history-panel').classList.toggle('hidden');
}

/* Keyboard */
document.addEventListener('keydown',e=>{
if(e.key>=0 && e.key<=9 || e.key==='.'){calculator.appendNumber(e.key);}
if(e.key==='Enter'){e.preventDefault();calculator.compute();}
if(e.key==='Backspace'){calculator.delete();}
if(e.key==='Escape'){calculator.clear();}
if(['+','-','*','/'].includes(e.key)){calculator.chooseOperation(e.key);}
});
