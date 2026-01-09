/*!
 * panel game 0.1 by @kittens-labs
 * https://kittens-labs.onrender.com
 * License MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) kittens-labs
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//zoom cancel
document.addEventListener('touchstart', function(event) {
	    if (event.touches.length > 1) {
	        event.preventDefault();
	    }
}, { passive: false });
document.addEventListener("dblclick", function(e){
	e.preventDefault();}, { passive: false });

//cookie
const cookies = document.cookie;
const array = cookies.split(';');
let start_flg=false;
function getCookie(key){
	let ret;
	array.forEach(function(value){
						const content = value.split('=');
						if(content[0].trim() == key){
							ret = content[1].trim();
							try{
								if(isNaN(ret)){
									throw new Error('number format error.');
								}
							}catch(e){
								ret = undefined;
							}
							return ret;
						}
	})
	return ret;
}
function setCookie(key, value){
	document.cookie = key+'='+value;
}

//url param
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode'); //0 src, 1 autogen
const stage = urlParams.get('stage');
const size  = urlParams.get('size');
const rate  = urlParams.get('rate');
const overlap_max = urlParams.get('overlap_max');
const pic_additional_context = urlParams.get('ctx');
try{
	//alert(mode+" "+stage+" "+size+" "+rate+" "+overlap_max);
	_mode = parseInt(mode);
	_stage = parseInt(stage);
	_size  = parseInt(size);
	_rate  = parseInt(rate);
	_overlap_max = parseInt(overlap_max);
	_pic_additional_context = parseInt(pic_additional_context);
	//alert(_mode+" "+_stage+" "+_size+" "+_rate+" "+_overlap_max);
	if(isNaN(_stage) || isNaN(_size) || isNaN(_mode)
	|| isNaN(_rate)  || isNaN(_overlap_max)
	|| isNaN(_pic_additional_context)){
		throw new Error('number format error.');
	}
	if(_pic_additional_context == 0){
		_pic_additional_context = "";
	}
	if(_rate < 0){
		_rate = 0;
	}
}catch(e){
	_mode  = 0;
	_stage = 1;
	_size = 20;
	_rate = 80;
	_overlap_max = 2;
	_pic_additional_context = "";
}

//panel
panel_width = 46;
panel_height = 46;
//effect
effect_width = 200;
effect_height = 200;
//canvas
canvas_width = 400;
canvas_height = 600;
//stage autogen
max_stage_autogen = 100;
//stage manual
max_stage_manual = 5;

//background pic layer
var bg_pic = new Image();
bg_pic.onload = function() {
        // 画像サイズ取得
        var width = bg_pic.width;
        var height = bg_pic.height;
        // canvasの定義
        var canvas = document.getElementById('wallpaper-area');
        var ctx = canvas.getContext('2d');
		canvas.width = canvas_width;
        canvas.height = canvas_height;
        // 画像を canvas に表示
        ctx.drawImage(bg_pic, 0, 0, canvas_width,canvas_height);
}
bg_pic.src = "/resource/"+_pic_additional_context+""+(stage%10)+".jpg";

//effect animation layer
function addGif(x,y,_x,_y){
  let image = new Image();
  image.onload = () => {
    //const canvas = document.getElementById('animation-area');
    //canvas.width = 400;
    //canvas.height = 600;

	$(".canvas-wrapper").append('<canvas id="animate_'+x+'_'+y+'"></canvas>');;
	const canvas = document.getElementById('animate_'+x+'_'+y);
	canvas.width = image.width / 2;
    canvas.height = image.height / 2;
	canvas.style.top = y;
	canvas.style.left = x;
	canvas.style.zIndex = 3;
	canvas.style.border="0px solid #999999";
    const onDrawFrame = (ctx, frame) => {
      ctx.clearRect(_x, _y,canvas.width, canvas.height);
      ctx.drawImage(frame.buffer, _x, _y, canvas.width, canvas.height);
    };
	setTimeout(function(){
		$('#animate_'+x+'_'+y).remove();
	},3000);

	
    gifler(image.src)
      .animate(canvas)
      .then(function(animator){
        animator.onDrawFrame = onDrawFrame;
        animator.animateInCanvas(canvas, false);
      });
	  
	//gifler(image.src).animate(canvas);
  };
  image.src = "/resource/effect.gif";
};
function addEffect(x, y){
	//alert(x+" "+y)
	newx = y*panel_height+(y*5)-71;
	newy = x*panel_width+(x*5)-71;
	_x = 0;
	_y = 0;
	
	if(newx < 0){
		_x = newx;
		newx =0;
	}
	if(newx > (canvas_width-effect_width)){
		_x = newx-(canvas_width-effect_width);
		newx = (canvas_width-effect_width);
	}

	if(newy < 0){
		_y = newy;
		newy =0;
	}
	if(newy > (canvas_height-effect_height)){
		_y = newy-(canvas_height-effect_height);
		newy = (canvas_height-effect_height);
	}
	addGif(newx,newy,_x,_y)
}

//out source
if(_mode == 0){
	//外部読み込み
	let scriptSrc = "/resource/stage"+_stage+".js";
	const script = document.createElement('script');
	script.src = scriptSrc;
	document.body.appendChild(script);
}

//button layer
const col_max = 8;
const row_max = 10;
$(document).ready(function() {
	//set roll over lock
	matrix_movelock = Array.from({ length: row_max }, () => new Array(col_max).fill(false));
	//now position
	matrix_now = [-1,-1]
	//start flg
	isStarted = false;

	//load panel param : level design
	//直接定義する場合
	matrix = [
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
		[0, 0, 0, 0 ,0 ,0 ,0, 0],
	];

	if(_mode == 1){
		//自動生成
		autoGenCode();
	}else{	
		window.onload = function() {
			matrix = JSON.parse(JSON.stringify(window.panelLib.stage_matrix));
			initPanel(matrix);
		}
	}

	//stageのdeep copy
	let copyMatrix = JSON.parse(JSON.stringify(matrix))

	//start
	$("#i_x_x").attr('src','/resource/start0.gif');

	//click mousemove でもok
	for(i = 0; i < row_max; i++){
		for(j = 0; j < col_max; j++){
			$("#i_"+i+"_"+j).on('click',{i:i,j:j},startGame);
			$("#i_"+i+"_"+j).on('mousemove',{i:i,j:j},moveEvent);
			$("#i_"+i+"_"+j).on('mouseout',{i:i,j:j},outEvent)

			$("#i_"+i+"_"+j).on('touchstart',{i:i,j:j},startGame);
			$("#i_"+i+"_"+j).on('touchmove',{i:i,j:j},moveEvent);
			$("#i_"+i+"_"+j).on('touchend',{i:i,j:j},outEvent)
			$("#i_"+i+"_"+j).on('touchcancel',{i:i,j:j},outEvent)
			$("#i_"+i+"_"+j).on('pointerout',{i:i,j:j},outEvent)

		}
	}	
	$('#clear-button').on('click',function(){
		//window.location.reload()
		//deep copy
		if(mode == 1){
			matrix = JSON.parse(JSON.stringify(copyMatrix));
		}else{
			matrix = JSON.parse(JSON.stringify(window.panelLib.stage_matrix));
		}
		restartInit();
		matrix_now[0] = -1;
		matrix_now[1] = -1;
		$("#i_x_x").attr('src','/resource/start0.gif');

	});

	function initPanel(_matrix){
			for(i = 0; i < row_max; i++){
				for(j = 0; j < col_max; j++){
					$("#i_"+i+"_"+j).attr('src','/resource/panel'+_matrix[i][j]+'.gif');
				}
			}
	}

	function startGame(event){
		isStarted = true;
		moveEvent(event);
	}

	function moveEvent(event){
				if(isStarted == false){
					return;
				}

				//clear check
				if(clearCheck() == true){
					$("#i_x_x").attr('src','/resource/clear0.gif');
					$("#i_"+event.data.i+"_"+event.data.j).attr('src','/resource/panel'+matrix[event.data.i][event.data.j]+'.gif');
					//alert("clear");
					nextPage();
					isStarted=false;
					return;
				}

				//game over check
				if(matrix_now[0] != -1 && matrix_now[1] != -1
					 && gameOverCheck(matrix_now[0], matrix_now[1])
					&& isStarted){
					$("#i_x_x").attr('src','/resource/over0.gif');
					$("#i_"+event.data.i+"_"+event.data.j).attr('src','/resource/panel'+matrix[event.data.i][event.data.j]+'.gif');
					isStarted = false;
					return;
				}

				if(matrix_now[0] == -1 && matrix_now[1] == -1){
					//初手のみ
					$("#i_x_x").attr('src','/resource/panel0.gif');
				}

				//移動可能list以外return
				//初手
				if(matrix_now[0] == -1 && matrix_now[1] == -1
					 && !firstMovable(event.data.i, event.data.j)){
					return;
				}
				//初手以外
				if(matrix_now[0] >= 0 && matrix_now[1] >= 0
					 && !isMovable(event.data.i, event.data.j)){
					return;
				}

				//更新可能のパネルかチェック
				if(matrix[event.data.i][event.data.j] <= 0 || matrix_movelock[event.data.i][event.data.j] == true){
					return;
				}

				//現在地更新
				matrix_now[0] = event.data.i;
				matrix_now[1] = event.data.j;

				//table color clear
				removeHighLight();

				if(matrix_now[0] == -1 && matrix_now[1] == -1){
					//初手
					//panel更新
					panelUpdate();

					//移動可能範囲ハイライト表示
					list_array = listOfMovable(event.data.i, event.data.j);
					viewHighLight(list_array);
				}else{
					//初手以外
					//panel更新
					panelUpdate();

					//移動可能範囲ハイライト表示
					list_array = listOfMovable(matrix_now[0], matrix_now[1]);
					viewHighLight(list_array);
				}

				function panelUpdate(){
					matrix[event.data.i][event.data.j]-=1;
					//$("#i_"+event.data.i+"_"+event.data.j).attr('src','/resource/panel'+matrix[event.data.i][event.data.j]+'.gif');
					$("#i_"+event.data.i+"_"+event.data.j).attr('src','/resource/panel'+matrix[event.data.i][event.data.j]+'now.gif');
					addEffect(+event.data.i,event.data.j);
					//move検知lock
					matrix_movelock[event.data.i][event.data.j] = true;
				}	
	}

	function outEvent(event){
		//move検知lock解除
		matrix_movelock[event.data.i][event.data.j] = false;
	}

	function viewHighLight(list_array){
		for(i = 0; i < list_array.length; i++){
			$("#p_"+list_array[i][0]+"_"+list_array[i][1]).attr('style','background-color: #ff0000;');
			$("#i_"+list_array[i][0]+"_"+list_array[i][1]).attr('src','/resource/panel'+matrix[list_array[i][0]][list_array[i][1]]+'over.gif');
		}
	}

	function removeHighLight(){
		//table color clear
		for(i = 0; i < row_max; i ++){
			for(j = 0; j < col_max; j++){
				$("#p_"+i+"_"+j).removeAttr('style');
				$("#i_"+i+"_"+j).attr('src','/resource/panel'+matrix[i][j]+'.gif');
			}
		}
	}

	//clear check
	function clearCheck(){
		for(i = 0; i < row_max; i++){
			for(j = 0; j < col_max; j++){
				if(matrix[i][j] > 0){
					return false;
				}
			}
		}
		return true;
	}

	function gameOverCheck(y, x){
		_list = listOfMovable(y, x);
		if(_list.length == 0 && !clearCheck()){
			return true;
		}
		return false;
	}

	//初手の移動可能かチェック
	function firstMovable(x, y){
		if(matrix[x][y] >= 1){
			return true;
		}
		return false;
	}

	//初手以外の移動可能かチェック
	function isMovable(y, x){
		list_array = listOfMovable(matrix_now[0], matrix_now[1]);
		for(i = 0; i < list_array.length; i++){
			if(y == list_array[i][0] && x == list_array[i][1]){
				return true;
			}
		}
		return false;
	}

	//移動可能ポジションリスト：ハイライト表示用
	function listOfMovable(y,x){
		if(y < 0 || x < 0){
			return new Array();
		}
		ret_array = new Array();
		if(y - 1 >= 0){
			if(matrix[y-1][x] > 0){ 
				ret_array.push([y-1, x])
			}
		}
		if(x - 1 >= 0){
			if(matrix[y][x-1] > 0){ 
				ret_array.push([y, x-1])
			}
		}
		if(y + 1 < row_max){
			if(matrix[y+1][x] > 0){ 
				ret_array.push([y+1, x])
			}
		}
		if(x + 1 < col_max){
			if(matrix[y][x+1] > 0){ 
				ret_array.push([y, x+1])
			}
		}
		return ret_array;
	}
	
	//移動可能ポジションリスト：自動生成用
	function listOfMovableGen(y,x){
		if(y < 0 || x < 0){
			return new Array();
		}
		ret_array = new Array();
		if(y - 1 >= 0){
			if(matrix[y-1][x] < _overlap_max){ 
				ret_array.push([y-1, x])
			}
		}
		if(x - 1 >= 0){
			if(matrix[y][x-1] < _overlap_max){ 
				ret_array.push([y, x-1])
			}
		}
		if(y + 1 < row_max){
			if(matrix[y+1][x] < _overlap_max){ 
				ret_array.push([y+1, x])
			}
		}
		if(x + 1 < col_max){
			if(matrix[y][x+1] < _overlap_max){ 
				ret_array.push([y, x+1])
			}
		}
		return ret_array;
	}

	function autoGenCode(){
		try{
			if(_size == undefined || _rate == undefined || _overlap_max == undefined
			|| isNaN(_size) || isNaN(_rate) || isNaN(_overlap_max)
			|| _size.length == 0 || _rate.length == 0 || _overlap_max.length == 0
			|| _rate < 0 || _rate > 100
			|| _size < 2 || _size > 1000
			|| _overlap_max < 1 || _overlap_max > 9
			){
				throw new Error("number format exception")
			}
		}catch(e){
			return;
		}
		//init position
		row = getRandomInt(row_max);
		col = getRandomInt(col_max);
		matrix[row][col]+=1;
		movable_list = listOfMovableGen(row,col);
		next_pos = movable_list[getRandomInt(movable_list.length)];
		matrix[next_pos[0]][next_pos[1]]+=1;
		matrix_now[0] = next_pos[0];
		matrix_now[1] = next_pos[1];
		angle = getAngle(row, col, next_pos[0], next_pos[1]);

		//next position 
		for(i = 0; i < _size-2; i++){

			let choices = [
				{ name: 'hit', weight: parseInt(_rate) }, //hit
				{ name: 'others', weight: parseInt(100-rate) },  //other
			];
			result = weightedRandom(choices);
			movable_list = listOfMovableGen(matrix_now[0],matrix_now[1]);
			if(movable_list.length == 0){
				//alert("none list")
				restartInit();
				return;
			}
			updateFlg = false;
			if(result == "hit"){
				for(j = 0; j < movable_list.length; j++){
					tmp_angle  = getAngle(matrix_now[0], matrix_now[1], movable_list[j][0], movable_list[j][1]);
					if(angle == tmp_angle){
						matrix[movable_list[j][0]][movable_list[j][1]] +=1;
						matrix_now[0] = movable_list[j][0];
						matrix_now[1] = movable_list[j][1];
						updateFlg = true;
						break;
					}
				}
			}
			if(updateFlg == false){
				let choices2 = [];
				if(movable_list.length >=3){
					choices2 = [
						{ name: parseInt(0), weight: parseInt(33) }, 
						{ name: parseInt(1), weight: parseInt(33) },  
						{ name: parseInt(2), weight: parseInt(34) },  
					];
				}else if(movable_list.length ==2) {
					choices2 = [
						{ name: parseInt(0), weight: parseInt(50) },
						{ name: parseInt(1), weight: parseInt(50) },  
					];
				}else if(movable_list.length ==1) {
					choices2 = [
						{ name: parseInt(0), weight: parseInt(100) },
					];
				}else{
					choices2 = [
						{ name: parseInt(0), weight: parseInt(100) },
					];
				}
				result2 = weightedRandom(choices2);
				matrix[movable_list[result2][0]][movable_list[result2][1]] +=1;
				matrix_now[0] = movable_list[result2][0];
				matrix_now[1] = movable_list[result2][1];		
			}
		}
		restartInit();

	}

	function restartInit(){
		removeHighLight();
		initPanel(matrix);
		matrix_now[0] = -1;
		matrix_now[1] = -1;
		isStarted = false;
		matrix_movelock = Array.from({ length: row_max }, () => new Array(col_max).fill(false));
		//clearMessage();
	}

	function getAngle(nowy, nowx, nexty, nextx){
		//up 0
		//right 1
		//down 2
		//left 3
		if(nowy > nexty && nowx > nextx){
			//up
			return 0;
		}
		if(nowy == nexty && nowx < nextx){
			//right
			return 1;
		}
		if(nowy < nexty && nowx < nextx){
			//down
			return 2;
		}if(nowy == nexty && nowx > nextx){
			//left
			return 3;
		}
	}
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
	function weightedRandom(items) {
		let totalWeight = items.reduce((sum, item) => sum + item.weight, 0); 
		let randomValue = Math.random() * totalWeight; 

		let cumulativeWeight = 0;
		for (const item of items) {
			cumulativeWeight += item.weight;
			if (randomValue < cumulativeWeight) {
			return item.name; 
			}
		}
		return items[items.length - 1].name;
	}
	
	//_mode  = 0;
	//_stage = 1;
	//_size = 20;
	//_rate = 80;
	//_overlap_max = 2;
	//srcmode max stage
	max_stage = 1;
	levelup_size = 5;
	minus_rate = 1;
	function nextPage(){
		try{
          if(_mode == 1){ //auto gen
			max_stage = max_stage_autogen;
			let links = "'/panel_index.html?stage="+(parseInt(urlParams.get('stage'))+1)+
			"&mode=1"+
			"&size="+(parseInt(urlParams.get('size'))+levelup_size)+
			"&rate="+(parseInt(urlParams.get('rate'))-minus_rate)+
			"&overlap_max="+(parseInt(urlParams.get('overlap_max')))+
			"&ctx="+(parseInt(urlParams.get('ctx')))+
			"'";
			if(max_stage <= parseInt(urlParams.get('stage'))){
				links = "'/stage_clear.html'"
			}
			let text = '<button onclick="location.href='+links+'" type="button" style="height: 50px;" id="start-button"><img src="/resource/next.gif" alt="NEXT STAGE" style="height: 100%;"></button>&nbsp;&nbsp;<font color="ff0000">NEXT!</font>'
		    $('#next').html(text);
		  }else{ //src
			max_stage = max_stage_manual;
			let links = "'/panel_index.html?stage="+(parseInt(urlParams.get('stage'))+1)+
			"&mode=0"+
			"&size=1"+
			"&rate=1"+
			"&overlap_max=1"+
			"&ctx="+(parseInt(urlParams.get('ctx')))+
			"'";
			if(max_stage <= parseInt(urlParams.get('stage'))){
				links = "'/tutorial_clear.html'"
			}
			let text = '<button onclick="location.href='+links+'" type="button" style="height: 50px;" id="start-button"><img src="/resource/next.gif" alt="NEXT STAGE" style="height: 100%;"></button>&nbsp;&nbsp;<font color="ff0000">NEXT!</font>'
		    $('#next').html(text);
		  }
		}catch(e){
			alert("catch wow");
		}

	}

	function message(str,x,y){
		canvas = document.querySelector('#message-area');
		ctx = canvas.getContext('2d');
		ctx.font = "bold 35px 'Arial'"; 

		ctx.fillStyle = '#000000'; 
		ctx.fillText(str,x+2,y+2); 
		ctx.fillStyle = '#000000'; 
		ctx.fillText(str,x-2,y-2); 
		ctx.fillStyle = '#000000'; 
		ctx.fillText(str,x+2,y-2); 
		ctx.fillStyle = '#000000'; 
		ctx.fillText(str,x-2,y+2); 
		ctx.fillStyle = '#ffffff'; 
		ctx.fillText(str,x,y); 

	}
	function clearMessage(){
        canvas = document.querySelector('#message-area');
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'rgba(255, 255, 255, 0)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	window.panelMainLib= window.panelMainLib|| {};
	window.panelMainLib.message = message; 
	window.panelMainLib.clearMessage = clearMessage; 

	//language detect
	function isJP(){
		const navi = navigator;
		if(navigator === undefined || navigator === null){
			return true;
		}
		const language = navigator.language;
		if(language == "ja" || language == "ja-JP"){
			return true;
		}else{
			return false;
		}
	}
	window.panelMainLib.isJP = isJP; 
});
