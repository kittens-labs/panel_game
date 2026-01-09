stage_matrix = [
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,1,1,2,1,0,0,],
]
window.panelLib= window.panelLib|| {};
window.panelLib.stage_matrix = stage_matrix; 

if(window.panelMainLib.isJP()){
    window.panelMainLib.message("パネルをタッチすると", 10,60);
    window.panelMainLib.message("赤色が現在位置", 10,100);
    window.panelMainLib.message("移動可能は上下左右", 10,180);
    window.panelMainLib.message("ハイライトで表示", 10,220);

    window.panelMainLib.message("パネルの数字は", 10,300);
    window.panelMainLib.message("移動すると減る", 10,340);
    window.panelMainLib.message("すべてを0にする", 10,380);
    window.panelMainLib.message("パスを考えよう", 10,420);
}else{
    window.panelMainLib.message("Touching a panel ", 10,60);
    window.panelMainLib.message("highlights its current ", 10,100);
    window.panelMainLib.message("position in red.", 10,140);
    window.panelMainLib.message("Movable panels are", 10,180);
    window.panelMainLib.message("highlighted.", 10,220);

    window.panelMainLib.message("The number on a panel ", 10,300);
    window.panelMainLib.message("decreases when moved.", 10,340);
    window.panelMainLib.message("Plan a path to reduce", 10,380);
    window.panelMainLib.message("all numbers to zero.", 10,420);
}
