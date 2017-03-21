var list = ["apple","bannan", "orange", "mango","watermellon"];

for ( var i = 0;  i < list.length; i++){
  var curr,prev,next;

  if(i==0){
    curr = i;
    next = i+1;
    prev = null;
  }
  else if(i == list.length-1){
    curr = i;
    prev = i-1;
    next = null;
  }
  else{
    curr = i;
    prev = i-1;
    next = i+1;
  }
  console.log("prev: "+ prev +"curr: "+ curr + "next: "+ next );

  console.log(list);

  if (prev!= null && list[prev].includes("orange")){
    list.splice(prev,1);
  }

}

console.log("prev: "+ prev +"curr: "+ curr + "next: "+ next );

console.log(list);
